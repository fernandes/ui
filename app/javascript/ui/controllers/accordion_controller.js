import { Controller } from "@hotwired/stimulus"
import { syncExpandedState } from "../utils/state-manager.js"
import { ensureId, setIdRefs } from "../utils/id-manager.js"

// Accordion controller for collapsible content sections
// Implements WAI-ARIA APG Accordion Pattern keyboard navigation
// https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
export default class extends Controller {
  static targets = ["item", "trigger", "content"]
  static values = {
    type: { type: String, default: "single" }, // "single" or "multiple"
    // Single type only: whether the open item can be closed again (Radix
    // `collapsible`). Defaults to true here to keep existing pages working.
    collapsible: { type: Boolean, default: true }
  }

  connect() {
    this.wireItems()
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

  // Per-instance ids (X1) and disabled state, item by item. Ids the author
  // rendered are kept.
  wireItems() {
    this.itemTargets.forEach((item, index) => {
      const trigger = this.triggerTargets[index]
      const content = this.contentTargets[index]
      if (!trigger || !content) return

      ensureId(trigger, "accordion-trigger")
      ensureId(content, "accordion-content")
      setIdRefs(trigger, "aria-controls", content)
      setIdRefs(content, "aria-labelledby", trigger)

      if (item.hasAttribute("data-disabled")) {
        trigger.disabled = true
        trigger.setAttribute("data-disabled", "")
        content.setAttribute("data-disabled", "")
      }
    })
    this.syncLockedTriggers()
  }

  isDisabled(trigger) {
    return trigger.disabled || trigger.hasAttribute("data-disabled")
  }

  // Single, non-collapsible: the open item's trigger can't close it, so it
  // is announced as disabled (Radix sets aria-disabled the same way).
  syncLockedTriggers() {
    const locks = this.typeValue === "single" && !this.collapsibleValue
    this.itemTargets.forEach((item, index) => {
      const trigger = this.triggerTargets[index]
      if (!trigger || this.isDisabled(trigger)) return
      if (locks && item.dataset.state === "open") {
        trigger.setAttribute("aria-disabled", "true")
      } else {
        trigger.removeAttribute("aria-disabled")
      }
    })
  }

  handleKeydown(event) {
    const trigger = event.target.closest("[data-ui--accordion-target='trigger']")
    if (!trigger) return

    // Arrow keys move between enabled triggers only (X6)
    const triggers = this.triggerTargets.filter((t) => !this.isDisabled(t))
    const currentIndex = triggers.indexOf(trigger)
    if (currentIndex === -1) return

    let targetIndex = -1
    let shouldPreventDefault = true

    switch (event.key) {
      case "ArrowDown":
        // Move focus to next trigger, wrap to first if at end
        targetIndex = (currentIndex + 1) % triggers.length
        break

      case "ArrowUp":
        // Move focus to previous trigger, wrap to last if at start
        targetIndex = currentIndex - 1
        if (targetIndex < 0) {
          targetIndex = triggers.length - 1
        }
        break

      case "Home":
        // Move focus to first trigger
        targetIndex = 0
        break

      case "End":
        // Move focus to last trigger
        targetIndex = triggers.length - 1
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

    if (targetIndex !== -1 && triggers[targetIndex]) {
      triggers[targetIndex].focus()
    }
  }

  setupItems() {
    this.itemTargets.forEach((item, index) => {
      const content = this.contentTargets[index]

      if (content) {
        const isOpen = item.dataset.state === "open"

        if (isOpen) {
          // Use auto for initially open items to handle cases where
          // the element is inside a hidden container (scrollHeight would be 0)
          content.style.height = 'auto'
        } else {
          content.style.height = '0px'
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

    if (!item || this.isDisabled(trigger)) return

    const isOpen = item.dataset.state === "open"
    const shouldOpen = !isOpen

    // Single, non-collapsible: the open item stays open
    if (isOpen && this.typeValue === "single" && !this.collapsibleValue) return

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
    this.syncLockedTriggers()
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
      // Closing: first set explicit height (for items with height: auto),
      // then animate to 0. CSS can't transition from 'auto' to '0px'.
      const currentHeight = content.scrollHeight
      content.style.height = `${currentHeight}px`

      // Force reflow to ensure the browser registers the height change
      content.offsetHeight

      // Now animate to 0
      content.style.height = '0px'

      const hideIfClosed = () => {
        if (content.dataset.state === 'closed') {
          content.setAttribute('hidden', '')
        }
      }

      // No transition runs (transitions disabled, reduced-motion styles,
      // height already 0): transitionend never fires, so hide now (X10)
      if (!this.isAnimating(content)) {
        hideIfClosed()
      } else {
        content.addEventListener('transitionend', hideIfClosed, { once: true })
        content.addEventListener('transitioncancel', hideIfClosed, { once: true })
      }
    }
  }

  isAnimating(element) {
    if (typeof element.getAnimations !== "function") return true
    return element.getAnimations().length > 0
  }
}
