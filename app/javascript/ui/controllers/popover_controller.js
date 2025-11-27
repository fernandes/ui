import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"
import { createPositioner } from "../utils/floating-ui-positioner.js"
import { onEscapeKeyWhen } from "../utils/escape-key-manager.js"
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
    console.log("placement", this.placementValue)
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

    // Close on Escape key (only when open)
    this.cleanupEscape = onEscapeKeyWhen(() => this.hide(), () => this.openValue)
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

    // Remove escape key listener
    if (this.cleanupEscape) {
      this.cleanupEscape()
    }

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
    this.openValue = true
    setState(this.contentTarget, 'open')

    // Start positioning
    if (this.positioner) {
      this.positioner.start()
    }

    // Dispatch custom event for other controllers to listen
    this.element.dispatchEvent(new CustomEvent('popover:show', {
      bubbles: true,
      detail: { popover: this }
    }))
  }

  hide() {
    this.openValue = false
    setState(this.contentTarget, 'closed')

    // Stop positioning when hiding
    if (this.positioner) {
      this.positioner.stop()
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
