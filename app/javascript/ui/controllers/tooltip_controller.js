import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"
import { createPositioner, getPlacementFromAttributes } from "../utils/floating-ui-positioner.js"
import { createEscapeLayer } from "../utils/escape-key-manager.js"
import { ensureId, addIdRef, removeIdRef } from "../utils/id-manager.js"

// Grace period between leaving the trigger and reaching the tooltip, so the
// pointer can move onto the content (WCAG 1.4.13 "hoverable").
const HIDE_GRACE_MS = 100

// Tooltip controller using Floating UI for positioning
// Structure: Tooltip (root) > Trigger + Content
//
// A11y (WAI-ARIA APG tooltip, Radix Tooltip):
// - content is role="tooltip" with a per-instance id; the trigger's
//   aria-describedby points at it (added to any value the author set)
// - opens on hover and keyboard focus, not on the focus a mouse click causes
// - hoverable: moving the pointer onto the tooltip keeps it open
// - Escape closes it (topmost layer only)
//
// Note: Targets are optional because content is moved to document.body during connect()
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    sideOffset: { type: Number, default: 4 },
    hoverDelay: { type: Number, default: 0 }
  }

  connect() {
    this.hoverTimeout = null
    this.hideTimeout = null
    this.isOpen = false
    this.positioner = null
    this.pointerDown = false

    // Store reference to content before moving it
    // Once we move it to body, Stimulus loses the target reference
    if (this.hasContentTarget) {
      this.content = this.contentTarget
      this.originalParent = this.content.parentNode

      ensureId(this.content, "tooltip")
      if (this.hasTriggerTarget) {
        this.trigger = this.triggerTarget
        addIdRef(this.trigger, "aria-describedby", this.content, "tooltip")
      }

      this.escapeLayer = createEscapeLayer(() => this.hide(), { element: this.content })

      // Hoverable content: entering it cancels the pending hide
      this.onContentEnter = () => this.cancelHide()
      this.onContentLeave = () => this.scheduleHide()
      this.content.addEventListener("mouseenter", this.onContentEnter)
      this.content.addEventListener("mouseleave", this.onContentLeave)

      // Move content to body on next tick after Stimulus has finished connecting
      requestAnimationFrame(() => {
        if (this.content) {
          document.body.appendChild(this.content)
        }
      })
    }

    if (this.hasTriggerTarget) {
      // A click closes the tooltip and the focus it causes doesn't reopen it
      this.onPointerDown = () => {
        this.pointerDown = true
        this.hide()
        document.addEventListener("pointerup", this.onPointerUp, { once: true })
      }
      this.onPointerUp = () => {
        setTimeout(() => { this.pointerDown = false }, 0)
      }
      this.triggerTarget.addEventListener("pointerdown", this.onPointerDown)
    }
  }

  disconnect() {
    // Cleanup positioner
    if (this.positioner) {
      this.positioner.stop()
      this.positioner = null
    }

    this.clearTimers()
    this.escapeLayer?.deactivate()

    if (this.trigger) {
      this.trigger.removeEventListener("pointerdown", this.onPointerDown)
      if (this.content) removeIdRef(this.trigger, "aria-describedby", this.content)
    }
    document.removeEventListener("pointerup", this.onPointerUp)

    if (this.content) {
      this.content.removeEventListener("mouseenter", this.onContentEnter)
      this.content.removeEventListener("mouseleave", this.onContentLeave)
    }

    // Return content to original parent
    if (this.content && this.content.parentNode === document.body) {
      if (this.originalParent) {
        this.originalParent.appendChild(this.content)
      } else {
        document.body.removeChild(this.content)
      }
    }
  }

  show(event) {
    // Focus caused by a mouse click / touch is not a request for the tooltip
    if (event?.type === "focus" && this.pointerDown) return

    this.cancelHide()

    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }

    // Apply hover delay before showing
    this.hoverTimeout = setTimeout(() => {
      this.hoverTimeout = null
      if (!this.content || !this.hasTriggerTarget) return

      this.isOpen = true
      setState(this.content, "open")
      this.escapeLayer?.activate()

      // Update position with Floating UI
      this.updatePosition()
    }, this.hoverDelayValue)
  }

  hide(event) {
    // Leaving the trigger with the pointer waits a moment, so the pointer can
    // reach the tooltip; blur, Escape and clicks close at once.
    if (event?.type === "mouseleave" && this.isOpen) {
      this.scheduleHide()
      return
    }

    this.clearTimers()

    if (!this.content) return

    this.isOpen = false
    setState(this.content, "closed")
    this.escapeLayer?.deactivate()

    // Cleanup positioner when hiding
    if (this.positioner) {
      this.positioner.stop()
    }
  }

  scheduleHide() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
    }
    this.cancelHide()
    this.hideTimeout = setTimeout(() => {
      this.hideTimeout = null
      this.hide()
    }, HIDE_GRACE_MS)
  }

  cancelHide() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
      this.hideTimeout = null
    }
  }

  clearTimers() {
    this.cancelHide()
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout)
      this.hoverTimeout = null
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
