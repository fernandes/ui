import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"
import { createPositioner } from "../utils/floating-ui-positioner.js"
import { createClickOutsideHandler } from "../utils/click-outside-manager.js"
import { createEscapeLayer } from "../utils/escape-key-manager.js"
import { ensureId, setIdRefs } from "../utils/id-manager.js"
import { focusInitial } from "../utils/focus-trap-manager.js"

const FOCUSABLE_TRIGGER = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

// Popover controller for floating content panels using Floating UI.
//
// Non-modal dialog (WAI-ARIA APG, Radix Popover): the trigger button carries
// aria-haspopup="dialog", aria-expanded and aria-controls; the content is
// role="dialog". Opening from the trigger moves focus into the content
// (opt out with auto-focus-value="false"); Escape closes the topmost layer
// and returns focus to the trigger.
//
// Public API (used by Combobox, Date Picker and host apps):
//   show(), hide({ returnFocus }), toggle(event), close() action
//   events: popover:show, popover:hide (only on a real state change)
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    open: { type: Boolean, default: false },
    placement: { type: String, default: "bottom" },
    offset: { type: Number, default: 4 },
    trigger: { type: String, default: "click" }, // "click", "hover" or "manual"
    hoverDelay: { type: Number, default: 200 },
    autoFocus: { type: Boolean, default: true }
  }

  connect() {
    // Only setup if we have both targets
    if (!this.hasTriggerTarget || !this.hasContentTarget) {
      return
    }

    this.isShown = false
    const startOpen = this.openValue
    this.openValue = false

    setState(this.contentTarget, "closed")
    // A11y: `inert` keeps the closed content out of the tab order (Safari
    // mobile doesn't honour `visibility:hidden` for tabbing consistently).
    this.contentTarget.inert = true

    // Ids and relationships, wired on the client so ERB/Phlex/VC share them
    ensureId(this.contentTarget, "popover-content")
    this.syncTriggerAria()

    this.positioner = createPositioner(this.triggerTarget, this.contentTarget, {
      placement: this.placementValue,
      offsetValue: this.offsetValue
    })

    this.escapeLayer = createEscapeLayer(() => this.hide({ returnFocus: true }), { element: this.contentTarget })

    // "manual" mode means the popover is controlled programmatically
    if (this.triggerValue === "click") {
      this.setupClickTrigger()
    } else if (this.triggerValue === "hover") {
      this.setupHoverTrigger()
    }

    // Listen for focus leaving the popover
    this.boundHandleFocusOut = this.handleFocusOut.bind(this)
    this.element.addEventListener("focusout", this.boundHandleFocusOut)

    if (startOpen) this.show()
  }

  disconnect() {
    if (this.positioner) {
      this.positioner.stop()
      this.positioner = null
    }

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    this.cancelFocusRetry()
    this.escapeLayer?.deactivate()

    if (this.clickOutsideHandler) {
      this.clickOutsideHandler.detach()
    }

    if (this.boundHandleTriggerClick) {
      this.triggerTarget.removeEventListener("click", this.boundHandleTriggerClick)
    }

    if (this.boundHandleMouseEnter) {
      this.triggerTarget.removeEventListener("mouseenter", this.boundHandleMouseEnter)
      this.element.removeEventListener("mouseleave", this.boundHandleMouseLeave)
    }

    if (this.boundHandleFocusOut) {
      this.element.removeEventListener("focusout", this.boundHandleFocusOut)
    }
  }

  // The element that receives aria-* and focus: the trigger itself when it's
  // focusable (as_child), otherwise the first focusable element inside it.
  findTriggerElementToFocus() {
    if (!this.hasTriggerTarget) return null
    if (this.triggerTarget.matches(FOCUSABLE_TRIGGER)) return this.triggerTarget
    return this.triggerTarget.querySelector(FOCUSABLE_TRIGGER)
  }

  syncTriggerAria() {
    const button = this.findTriggerElementToFocus()
    if (!button) return

    // Keep an author's value (a combobox trigger announces a listbox)
    if (!button.hasAttribute("aria-haspopup")) button.setAttribute("aria-haspopup", "dialog")
    button.setAttribute("aria-expanded", String(Boolean(this.isShown)))
    setIdRefs(button, "aria-controls", this.contentTarget, { prefix: "popover-content" })
  }

  handleFocusOut() {
    // Don't do anything if popover is not open or if we're closing programmatically
    if (!this.isShown || this.isClosing) return

    // Let the browser settle focus on its new target first
    setTimeout(() => {
      if (!this.isShown || this.isClosing) return
      const newFocusedElement = document.activeElement

      if (!newFocusedElement || newFocusedElement === document.body) {
        return this.hide({ returnFocus: true })
      }

      // Focus moved outside the popover: close without stealing it back
      if (!this.element.contains(newFocusedElement)) {
        this.hide({ returnFocus: false })
      }
    }, 0)
  }

  setupClickTrigger() {
    this.boundHandleTriggerClick = this.toggle.bind(this)
    this.triggerTarget.addEventListener("click", this.boundHandleTriggerClick)

    this.clickOutsideHandler = createClickOutsideHandler(
      this.element,
      () => this.hide()
    )
    this.clickOutsideHandler.attach()
  }

  setupHoverTrigger() {
    this.boundHandleMouseEnter = this.handleMouseEnter.bind(this)
    this.boundHandleMouseLeave = this.handleMouseLeave.bind(this)
    this.triggerTarget.addEventListener("mouseenter", this.boundHandleMouseEnter)
    this.element.addEventListener("mouseleave", this.boundHandleMouseLeave)

    // Keyboard users can't hover: Enter/Space on the trigger opens it too
    this.boundHandleTriggerClick = this.handleHoverTriggerClick.bind(this)
    this.triggerTarget.addEventListener("click", this.boundHandleTriggerClick)
  }

  handleHoverTriggerClick(event) {
    // A keyboard-activated click has detail 0. A mouse click on a popover the
    // pointer already opened keeps it open (it no longer closes on leave).
    const fromKeyboard = event.detail === 0
    if (!this.isShown) {
      this.show({ focus: fromKeyboard && this.autoFocusValue })
    } else if (fromKeyboard) {
      this.hide({ returnFocus: true })
    } else {
      this.openedByHover = false
    }
  }

  toggle(event) {
    event?.stopPropagation?.()

    if (this.isShown) {
      this.hide()
    } else {
      this.show({ focus: this.autoFocusValue })
    }
  }

  // Action for a close button inside the content
  close() {
    this.hide({ returnFocus: true })
  }

  /**
   * Open the popover. No-op when already open.
   * @param {Object|Event} options - `{ focus: true }` moves focus into the
   *   content. Called as a Stimulus action (with an Event), focus follows
   *   the auto-focus value.
   */
  show(options = {}) {
    if (this.isShown || !this.hasContentTarget) return
    const focus = options instanceof Event ? this.autoFocusValue : Boolean(options?.focus)

    this.isShown = true
    this.openValue = true
    this.triggerElementToFocus = this.findTriggerElementToFocus()

    setState(this.contentTarget, "open")
    this.contentTarget.classList.remove("hidden")
    this.contentTarget.inert = false
    this.syncTriggerAria()

    if (this.positioner) {
      this.positioner.start()
    }

    this.escapeLayer?.activate()

    if (focus) this.moveFocusIn()

    this.element.dispatchEvent(new CustomEvent("popover:show", {
      bubbles: true,
      detail: { popover: this }
    }))
  }

  /**
   * Close the popover. No-op when already closed, so an outside click on a
   * closed popover doesn't reset Command/Combobox via popover:hide.
   * @param {Object} options
   * @param {boolean} options.returnFocus - focus the trigger after closing
   */
  hide(options = {}) {
    if (!this.isShown) return
    const returnFocus = !(options instanceof Event) && Boolean(options?.returnFocus)

    // Set flag to prevent handleFocusOut from interfering
    this.isClosing = true
    this.isShown = false
    this.openValue = false
    this.openedByHover = false
    this.cancelFocusRetry()
    this.escapeLayer?.deactivate()

    setState(this.contentTarget, "closed")
    this.contentTarget.classList.add("hidden")
    this.syncTriggerAria()

    const target = this.triggerElementToFocus || this.findTriggerElementToFocus()

    // Hand focus back before the content goes inert, so it never drops to <body>
    if (returnFocus && target) target.focus()

    this.contentTarget.inert = true

    if (this.positioner) {
      this.positioner.stop()
    }

    if (returnFocus && target) {
      // Some browsers (Firefox) move focus again while processing the click
      // that closed the popover; put it back if it landed on <body>.
      setTimeout(() => {
        const active = document.activeElement
        if (!this.isShown && (!active || active === document.body || this.contentTarget.contains(active))) {
          target.focus()
        }
        this.isClosing = false
      }, 0)
    } else {
      this.isClosing = false
    }

    this.element.dispatchEvent(new CustomEvent("popover:hide", {
      bubbles: true,
      detail: { popover: this }
    }))
  }

  // The content may still compute as hidden on the frame it opens; retry on
  // the next frames until focus lands inside (or the popover closes).
  moveFocusIn(framesLeft = 10) {
    this.focusFrame = null
    if (!this.isShown || this.contentTarget.contains(document.activeElement)) return

    focusInitial(this.contentTarget)

    if (!this.contentTarget.contains(document.activeElement) && framesLeft > 0) {
      this.focusFrame = requestAnimationFrame(() => this.moveFocusIn(framesLeft - 1))
    }
  }

  cancelFocusRetry() {
    if (this.focusFrame) {
      cancelAnimationFrame(this.focusFrame)
      this.focusFrame = null
    }
  }

  handleMouseEnter() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
    }

    this.hoverTimeout = setTimeout(() => {
      if (this.isShown) return
      this.show()
      this.openedByHover = true
    }, this.hoverDelayValue)
  }

  handleMouseLeave() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    // A popover opened from the keyboard stays until Escape / focus leaves
    if (this.openedByHover) this.hide()
  }
}
