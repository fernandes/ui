import { Controller } from "@hotwired/stimulus"
import { syncExpandedState } from "../utils/state-manager.js"

// Accordion controller for collapsible content sections
// Implements WAI-ARIA APG Accordion Pattern keyboard navigation
// https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
export default class extends Controller {
  static targets = ["item", "trigger", "content"]
  static values = {
    type: { type: String, default: "single" }, // "single" or "multiple"
    collapsible: { type: Boolean, default: false }
  }

  connect() {
    this.setupItems()
    this.setupKeyboardNavigation()
  }

  disconnect() {
    this.removeKeyboardNavigation()
  }

  setupKeyboardNavigation() {
    this.handleKeydown = this.handleKeydown.bind(this)
    this.element.addEventListener("keydown", this.handleKeydown)
  }

  removeKeyboardNavigation() {
    this.element.removeEventListener("keydown", this.handleKeydown)
  }

  handleKeydown(event) {
    const trigger = event.target.closest("[data-ui--accordion-target='trigger']")
    if (!trigger) return

    const currentIndex = this.triggerTargets.indexOf(trigger)
    if (currentIndex === -1) return

    let targetIndex = -1
    let shouldPreventDefault = true

    switch (event.key) {
      case "ArrowDown":
        // Move focus to next trigger, wrap to first if at end
        targetIndex = (currentIndex + 1) % this.triggerTargets.length
        break

      case "ArrowUp":
        // Move focus to previous trigger, wrap to last if at start
        targetIndex = currentIndex - 1
        if (targetIndex < 0) {
          targetIndex = this.triggerTargets.length - 1
        }
        break

      case "Home":
        // Move focus to first trigger
        targetIndex = 0
        break

      case "End":
        // Move focus to last trigger
        targetIndex = this.triggerTargets.length - 1
        break

      case "Enter":
      case " ":
        // Toggle current accordion item
        this.toggle({ currentTarget: trigger })
        break

      default:
        shouldPreventDefault = false
    }

    if (shouldPreventDefault) {
      event.preventDefault()
    }

    if (targetIndex !== -1 && this.triggerTargets[targetIndex]) {
      this.triggerTargets[targetIndex].focus()
    }
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

    // Update item data-state
    item.dataset.state = state

    // Update trigger using utility
    syncExpandedState(trigger, null, isOpen)

    // Update content state
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
