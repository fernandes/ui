import { Controller } from "@hotwired/stimulus"
import { computePosition, flip, offset, shift, autoUpdate } from "@floating-ui/dom"

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

  constructor() {
    super(...arguments)
    this.cleanup = null
    this.hoverTimeout = null
  }

  connect() {
    console.log("placement", this.placementValue)
    // Only setup if we have both targets
    if (!this.hasTriggerTarget || !this.hasContentTarget) {
      return
    }

    // Set initial state attribute
    if (!this.contentTarget.hasAttribute('data-state')) {
      this.contentTarget.setAttribute('data-state', this.openValue ? 'open' : 'closed')
    }

    // Setup trigger-based interaction
    // "manual" mode means the popover is controlled programmatically
    if (this.triggerValue === "click") {
      this.setupClickTrigger()
    } else if (this.triggerValue === "hover") {
      this.setupHoverTrigger()
    }
    // If trigger is "manual", don't setup any automatic handlers

    // Close on Escape key
    this.boundHandleEscape = this.handleEscape.bind(this)
    document.addEventListener('keydown', this.boundHandleEscape)
  }

  disconnect() {
    // Cleanup Floating UI auto-update
    if (this.cleanup) {
      this.cleanup()
      this.cleanup = null
    }

    // Clear hover timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    // Remove event listeners
    document.removeEventListener('keydown', this.boundHandleEscape)

    if (this.boundHandleClickOutside) {
      document.removeEventListener('click', this.boundHandleClickOutside)
    }

    if (this.boundHandleTriggerClick) {
      this.triggerTarget.removeEventListener('click', this.boundHandleTriggerClick)
    }

    if (this.boundHandleMouseEnter) {
      this.triggerTarget.removeEventListener('mouseenter', this.boundHandleMouseEnter)
      this.element.removeEventListener('mouseleave', this.boundHandleMouseLeave)
    }
  }

  setupClickTrigger() {
    this.boundHandleTriggerClick = this.toggle.bind(this)
    this.triggerTarget.addEventListener('click', this.boundHandleTriggerClick)

    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    document.addEventListener('click', this.boundHandleClickOutside)
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
    this.contentTarget.setAttribute('data-state', 'open')
    this.updatePosition()

    // Dispatch custom event for other controllers to listen
    this.element.dispatchEvent(new CustomEvent('popover:show', {
      bubbles: true,
      detail: { popover: this }
    }))
  }

  hide() {
    this.openValue = false
    this.contentTarget.setAttribute('data-state', 'closed')

    // Cleanup auto-update when hiding
    if (this.cleanup) {
      this.cleanup()
      this.cleanup = null
    }

    // Dispatch custom event for other controllers to listen
    this.element.dispatchEvent(new CustomEvent('popover:hide', {
      bubbles: true,
      detail: { popover: this }
    }))
  }

  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.hide()
    }
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

  handleEscape(event) {
    if (event.key === 'Escape' && this.openValue && this.hasContentTarget) {
      this.hide()
    }
  }

  updatePosition() {
    if (!this.hasTriggerTarget || !this.hasContentTarget) return

    // Cleanup previous auto-update if exists
    if (this.cleanup) {
      this.cleanup()
    }

    // Setup middleware based on configuration
    const middleware = []

    // Always add offset if specified
    if (this.offsetValue > 0) {
      middleware.push(offset(this.offsetValue))
    }

    // Add flip to automatically adjust placement when overflowing
    middleware.push(flip())

    // Add shift to keep popover in viewport
    middleware.push(shift({ padding: 8 }))

    // Use autoUpdate to keep position synchronized
    this.cleanup = autoUpdate(
      this.triggerTarget,
      this.contentTarget,
      () => {
        computePosition(this.triggerTarget, this.contentTarget, {
          placement: this.placementValue,
          middleware: middleware
        }).then(({ x, y, placement, middlewareData }) => {
          Object.assign(this.contentTarget.style, {
            left: `${x}px`,
            top: `${y}px`,
          })

          // Update data-side attribute for CSS styling
          const side = placement.split('-')[0]
          this.contentTarget.setAttribute('data-side', side)
        })
      },
      {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
        layoutShift: true,
        animationFrame: true
      }
    )
  }
}
