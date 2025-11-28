import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"
import { createPositioner } from "../utils/floating-ui-positioner.js"
import { createClickOutsideHandler } from "../utils/click-outside-manager.js"

// Popover controller for floating content panels using Floating UI
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    open: { type: Boolean, default: false },
    placement: { type: String, default: "bottom" },
    offset: { type: Number, default: 4 },
    trigger: { type: String, default: "click" }, // "click" or "hover"
    hoverDelay: { type: Number, default: 200 }
  }

  connect() {
    // Only setup if we have both targets
    if (!this.hasTriggerTarget || !this.hasContentTarget) {
      return
    }

    // Set initial state attribute
    if (!this.contentTarget.hasAttribute('data-state')) {
      setState(this.contentTarget, this.openValue ? 'open' : 'closed')
    }

    // Setup positioner
    this.positioner = createPositioner(this.triggerTarget, this.contentTarget, {
      placement: this.placementValue,
      offsetValue: this.offsetValue
    })

    // Setup trigger-based interaction
    // "manual" mode means the popover is controlled programmatically
    if (this.triggerValue === "click") {
      this.setupClickTrigger()
    } else if (this.triggerValue === "hover") {
      this.setupHoverTrigger()
    }
    // If trigger is "manual", don't setup any automatic handlers

    // Bind handlers (but don't attach keydown yet - only when open)
    this.boundHandleKeydown = this.handleKeydown.bind(this)

    // Listen for focus leaving the popover
    this.boundHandleFocusOut = this.handleFocusOut.bind(this)
    this.element.addEventListener('focusout', this.boundHandleFocusOut)
  }

  disconnect() {
    // Cleanup positioner
    if (this.positioner) {
      this.positioner.stop()
      this.positioner = null
    }

    // Clear hover timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    // Remove keydown listener (in case still attached)
    this.teardownKeyboardNavigation()

    // Remove click outside handler
    if (this.clickOutsideHandler) {
      this.clickOutsideHandler.detach()
    }

    // Remove trigger click handler
    if (this.boundHandleTriggerClick) {
      this.triggerTarget.removeEventListener('click', this.boundHandleTriggerClick)
    }

    // Remove hover handlers
    if (this.boundHandleMouseEnter) {
      this.triggerTarget.removeEventListener('mouseenter', this.boundHandleMouseEnter)
      this.element.removeEventListener('mouseleave', this.boundHandleMouseLeave)
    }

    // Remove focusout handler
    if (this.boundHandleFocusOut) {
      this.element.removeEventListener('focusout', this.boundHandleFocusOut)
    }
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', this.boundHandleKeydown)
  }

  teardownKeyboardNavigation() {
    if (this.boundHandleKeydown) {
      document.removeEventListener('keydown', this.boundHandleKeydown)
    }
  }

  handleFocusOut(event) {
    // Don't do anything if popover is not open or if we're closing programmatically
    if (!this.openValue || this.isClosing) return

    // Check if focus is moving outside the popover element
    // Use setTimeout to allow the new focus target to be set
    setTimeout(() => {
      const newFocusedElement = document.activeElement

      if (newFocusedElement === document.body) {
        return this.hide({returnFocus: true})
      }

      // If the new focused element is outside our popover, close without returning focus
      if (!this.element.contains(newFocusedElement)) {
        this.hide({ returnFocus: false })
      }
    }, 0)
  }

  handleKeydown(event) {
    // Only handle Escape when popover is open
    if (event.key === 'Escape' && this.openValue) {
      event.preventDefault()
      this.hide({ returnFocus: true })
    }
  }

  setupClickTrigger() {
    this.boundHandleTriggerClick = this.toggle.bind(this)
    this.triggerTarget.addEventListener('click', this.boundHandleTriggerClick)

    // Setup click outside handler using utility
    this.clickOutsideHandler = createClickOutsideHandler(
      this.element,
      () => this.hide()
    )
    this.clickOutsideHandler.attach()
  }

  setupHoverTrigger() {
    this.boundHandleMouseEnter = this.handleMouseEnter.bind(this)
    this.boundHandleMouseLeave = this.handleMouseLeave.bind(this)

    this.triggerTarget.addEventListener('mouseenter', this.boundHandleMouseEnter)
    this.element.addEventListener('mouseleave', this.boundHandleMouseLeave)
  }

  toggle(event) {
    event.stopPropagation()
    this.openValue = !this.openValue

    if (this.openValue) {
      this.show()
    } else {
      this.hide()
    }
  }

  show() {
    // Store the element that triggered the popover (WAI-ARIA best practice)
    // This ensures we can return focus to it when closing
    this.triggerElementToFocus = this.findTriggerElementToFocus()

    this.openValue = true
    setState(this.contentTarget, 'open')

    // Remove hidden class if present
    this.contentTarget.classList.remove('hidden')

    // Start positioning
    if (this.positioner) {
      this.positioner.start()
    }

    // Setup keyboard navigation
    this.setupKeyboardNavigation()

    // Dispatch custom event for other controllers to listen
    this.element.dispatchEvent(new CustomEvent('popover:show', {
      bubbles: true,
      detail: { popover: this }
    }))
  }

  // Find the focusable element in the trigger area and store reference
  findTriggerElementToFocus() {
    if (!this.triggerTarget) return null

    // Check if trigger itself is focusable
    const isFocusable = this.triggerTarget.matches('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')

    if (isFocusable) {
      return this.triggerTarget
    } else {
      // Find first focusable element inside the trigger
      return this.triggerTarget.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    }
  }

  hide(options = {}) {
    const { returnFocus = false } = options

    // Set flag to prevent handleFocusOut from interfering
    this.isClosing = true

    this.openValue = false
    setState(this.contentTarget, 'closed')

    // Also add hidden class like dropdown does for immediate hide
    this.contentTarget.classList.add('hidden')

    // Stop positioning when hiding
    if (this.positioner) {
      this.positioner.stop()
    }

    // Teardown keyboard navigation
    this.teardownKeyboardNavigation()

    // Return focus to the stored trigger element (WAI-ARIA best practice)
    // Use longer timeout for Firefox compatibility - allows browser to fully process close
    if (returnFocus && this.triggerElementToFocus) {
      setTimeout(() => {
        if (this.triggerElementToFocus) {
          this.triggerElementToFocus.focus()
        }
        this.isClosing = false
      }, 100)
    } else {
      this.isClosing = false
    }

    // Dispatch custom event for other controllers to listen
    this.element.dispatchEvent(new CustomEvent('popover:hide', {
      bubbles: true,
      detail: { popover: this }
    }))
  }

  handleMouseEnter() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
    }

    this.hoverTimeout = setTimeout(() => {
      this.show()
    }, this.hoverDelayValue)
  }

  handleMouseLeave() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    this.hide()
  }
}
