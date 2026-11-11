import { Controller } from "@hotwired/stimulus"
import { syncExpandedState } from "../utils/state-manager.js"
import { ensureId, setIdRefs } from "../utils/id-manager.js"

// Collapsible controller for expandable/collapsible content sections
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    open: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  }

  connect() {
    if (this.hasTriggerTarget && this.hasContentTarget) {
      ensureId(this.contentTarget, "collapsible-content")
      setIdRefs(this.triggerTarget, "aria-controls", this.contentTarget)
    }
    this.syncDisabled()
    this.updateState(this.openValue, false)
  }

  disabledValueChanged() {
    this.syncDisabled()
  }

  // Radix: a disabled collapsible disables its trigger and marks every
  // part with data-disabled. A non-button trigger (as_child) gets
  // aria-disabled instead.
  syncDisabled() {
    const disabled = this.disabledValue
    const parts = [this.element]
    if (this.hasContentTarget) parts.push(this.contentTarget)

    if (this.hasTriggerTarget) {
      const trigger = this.triggerTarget
      parts.push(trigger)
      if (trigger instanceof HTMLButtonElement) {
        trigger.disabled = disabled
      } else if (disabled) {
        trigger.setAttribute("aria-disabled", "true")
      } else {
        trigger.removeAttribute("aria-disabled")
      }
    }

    parts.forEach((el) => el.toggleAttribute("data-disabled", disabled))
  }

  toggle(event) {
    if (this.disabledValue) return

    event.preventDefault()
    this.openValue = !this.openValue
  }

  openValueChanged() {
    this.updateState(this.openValue, true)
  }

  updateState(isOpen, animate = true) {
    const state = isOpen ? "open" : "closed"

    // Update root element state
    this.element.dataset.state = state

    // Update trigger and content using utility
    syncExpandedState(
      this.hasTriggerTarget ? this.triggerTarget : null,
      null, // Don't use utility for content - we have custom height logic
      isOpen
    )

    // Update content with custom height animation
    if (this.hasContentTarget) {
      const content = this.contentTarget
      content.dataset.state = state

      if (isOpen) {
        // Opening: remove hidden and set height
        content.removeAttribute("hidden")
        // Force reflow to get correct scrollHeight after removing hidden
        void content.offsetHeight
        content.style.height = `${content.scrollHeight}px`
      } else {
        // Closing: animate to 0, then add hidden after transition
        const hideIfClosed = () => {
          if (content.dataset.state === "closed") {
            content.setAttribute("hidden", "")
          }
        }

        content.style.height = "0px"
        // Without a running transition transitionend never fires and the
        // content would stay tabbable (X10)
        if (animate && this.isAnimating(content)) {
          content.addEventListener("transitionend", hideIfClosed, { once: true })
          content.addEventListener("transitioncancel", hideIfClosed, { once: true })
        } else {
          content.setAttribute("hidden", "")
        }
      }
    }
  }

  isAnimating(element) {
    if (typeof element.getAnimations !== "function") return true
    return element.getAnimations().length > 0
  }
}
