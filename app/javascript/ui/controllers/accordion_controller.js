import { Controller } from "@hotwired/stimulus"

// Accordion controller for collapsible content sections
export default class extends Controller {
  static targets = ["item", "trigger", "content"]
  static values = {
    type: { type: String, default: "single" }, // "single" or "multiple"
    collapsible: { type: Boolean, default: false }
  }

  connect() {
    this.setupItems()
  }

  setupItems() {
    this.itemTargets.forEach((item, index) => {
      const content = this.contentTargets[index]

      if (content) {
        const isOpen = item.dataset.state === "open"
        content.style.height = isOpen ? `${content.scrollHeight}px` : '0px'

        if (!isOpen) {
          content.setAttribute('hidden', '')
        }
      }
    })
  }

  toggle(event) {
    const trigger = event.currentTarget
    const index = this.triggerTargets.indexOf(trigger)
    const item = this.itemTargets[index]
    const content = this.contentTargets[index]

    const isOpen = item.dataset.state === "open"
    const shouldOpen = !isOpen

    // For "single" type, close all other items when opening a new one
    if (this.typeValue === "single" && shouldOpen) {
      this.itemTargets.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index) {
          this.updateItemState(
            otherItem,
            this.triggerTargets[otherIndex],
            this.contentTargets[otherIndex],
            false
          )
        }
      })
    }

    this.updateItemState(item, trigger, content, shouldOpen)
  }

  updateItemState(item, trigger, content, isOpen) {
    const state = isOpen ? "open" : "closed"

    // Update all data-state attributes
    item.dataset.state = state
    trigger.dataset.state = state
    trigger.setAttribute("aria-expanded", isOpen)
    content.dataset.state = state

    // Update h3 wrapper state if it exists
    const h3 = trigger.parentElement
    if (h3 && h3.tagName === 'H3') {
      h3.dataset.state = state
    }

    if (isOpen) {
      // Opening: remove hidden and set height
      content.removeAttribute('hidden')
      content.style.height = `${content.scrollHeight}px`
    } else {
      // Closing: animate to 0, then add hidden after transition
      content.style.height = '0px'

      content.addEventListener('transitionend', () => {
        if (content.dataset.state === 'closed') {
          content.setAttribute('hidden', '')
        }
      }, { once: true })
    }
  }
}
