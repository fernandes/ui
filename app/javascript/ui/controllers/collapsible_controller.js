import { Controller } from "@hotwired/stimulus"

// Collapsible controller for expandable/collapsible content sections
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    open: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  }

  connect() {
    this.updateState(this.openValue, false)
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

    // Update trigger
    if (this.hasTriggerTarget) {
      this.triggerTarget.dataset.state = state
      this.triggerTarget.setAttribute("aria-expanded", isOpen)
    }

    // Update content
    if (this.hasContentTarget) {
      const content = this.contentTarget
      content.dataset.state = state

      if (isOpen) {
        // Opening: remove hidden and set height
        content.removeAttribute("hidden")
        content.style.height = `${content.scrollHeight}px`
      } else {
        // Closing: animate to 0, then add hidden after transition
        if (animate) {
          content.style.height = "0px"
          content.addEventListener("transitionend", () => {
            if (content.dataset.state === "closed") {
              content.setAttribute("hidden", "")
            }
          }, { once: true })
        } else {
          content.style.height = "0px"
          content.setAttribute("hidden", "")
        }
      }
    }
  }
}
