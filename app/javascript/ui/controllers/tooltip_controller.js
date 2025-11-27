import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"
import { createPositioner, getPlacementFromAttributes } from "../utils/floating-ui-positioner.js"
import { onEscapeKeyWhen } from "../utils/escape-key-manager.js"

// Tooltip controller using Floating UI for positioning
// Structure: Tooltip (root) > Trigger + Content
// Note: Targets are optional because content is moved to document.body during connect()
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    sideOffset: { type: Number, default: 4 },
    hoverDelay: { type: Number, default: 0 }
  }

  connect() {
    this.hoverTimeout = null
    this.isOpen = false
    this.positioner = null

    // Close on Escape key (only when open)
    this.cleanupEscape = onEscapeKeyWhen(() => this.hide(), () => this.isOpen)

    // Store reference to content before moving it
    // Once we move it to body, Stimulus loses the target reference
    if (this.hasContentTarget) {
      this.content = this.contentTarget
      this.originalParent = this.content.parentNode

      // Move content to body on next tick after Stimulus has finished connecting
      requestAnimationFrame(() => {
        if (this.content) {
          document.body.appendChild(this.content)
        }
      })
    }
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

    // Return content to original parent
    if (this.content && this.content.parentNode === document.body) {
      if (this.originalParent) {
        this.originalParent.appendChild(this.content)
      } else {
        document.body.removeChild(this.content)
      }
    }

    // Remove escape key listener
    if (this.cleanupEscape) {
      this.cleanupEscape()
    }
  }

  show() {
    // Clear any pending hide timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    // Apply hover delay before showing
    this.hoverTimeout = setTimeout(() => {
      if (!this.content || !this.hasTriggerTarget) return

      this.isOpen = true
      setState(this.content, 'open')

      // Update position with Floating UI
      this.updatePosition()
    }, this.hoverDelayValue)
  }

  hide() {
    // Clear show timeout if still pending
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    if (!this.content) return

    this.isOpen = false
    setState(this.content, 'closed')

    // Cleanup positioner when hiding
    if (this.positioner) {
      this.positioner.stop()
    }
  }

  updatePosition() {
    if (!this.content || !this.hasTriggerTarget) return

    // Get placement from content data attributes
    const placement = getPlacementFromAttributes(this.content)

    // Create or update positioner
    if (!this.positioner) {
      this.positioner = createPositioner(this.triggerTarget, this.content, {
        placement,
        offsetValue: this.sideOffsetValue
      })
    } else {
      this.positioner.setPlacement(placement)
    }

    this.positioner.start()
  }
}
