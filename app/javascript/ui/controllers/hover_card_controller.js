import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"

// Hover Card controller for floating content on hover
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    open: { type: Boolean, default: false },
    align: { type: String, default: "center" },
    sideOffset: { type: Number, default: 4 },
    openDelay: { type: Number, default: 200 },
    closeDelay: { type: Number, default: 300 }
  }

  connect() {
    this.showTimeout = null
    this.hideTimeout = null

    // Position content as fixed to overlay on page
    if (this.hasContentTarget) {
      this.contentTarget.style.position = 'fixed'
    }
  }

  disconnect() {
    this.clearTimeouts()
  }

  show() {
    this.clearTimeouts()

    this.showTimeout = setTimeout(() => {
      this.openValue = true
      this.contentTarget.classList.remove('invisible')
      this.contentTarget.classList.add('visible')
      setState(this.contentTarget, 'open')
      this.positionContent()
    }, this.openDelayValue)
  }

  hide() {
    this.clearTimeouts()

    this.hideTimeout = setTimeout(() => {
      this.openValue = false
      this.contentTarget.classList.remove('visible')
      this.contentTarget.classList.add('invisible')
      setState(this.contentTarget, 'closed')
    }, this.closeDelayValue)
  }

  keepOpen() {
    // Keep content open when hovering over it
    this.clearTimeouts()
  }

  scheduleHide() {
    // Schedule hide when leaving content
    this.hide()
  }

  clearTimeouts() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout)
      this.showTimeout = null
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
      this.hideTimeout = null
    }
  }

  positionContent() {
    const content = this.contentTarget
    if (!content) return

    const trigger = this.triggerTarget
    if (!trigger) return

    const triggerRect = trigger.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    // Get alignment and side offset from content data attributes
    const align = content.dataset.align || this.alignValue
    const sideOffset = parseInt(content.dataset.sideOffset) || this.sideOffsetValue

    // Determine vertical position (top or bottom)
    const spaceBelow = viewportHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top
    let side = 'bottom'

    if (spaceBelow < contentRect.height + sideOffset && spaceAbove > spaceBelow) {
      side = 'top'
    }

    // Apply positioning
    if (side === 'bottom') {
      content.style.top = `${triggerRect.bottom + sideOffset}px`
      content.setAttribute('data-side', 'bottom')
    } else {
      content.style.top = `${triggerRect.top - contentRect.height - sideOffset}px`
      content.setAttribute('data-side', 'top')
    }

    // Horizontal alignment
    if (align === 'center') {
      const left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2)
      content.style.left = `${Math.max(8, Math.min(left, viewportWidth - contentRect.width - 8))}px`
    } else if (align === 'start') {
      content.style.left = `${Math.max(8, triggerRect.left)}px`
    } else if (align === 'end') {
      content.style.left = `${Math.max(8, triggerRect.right - contentRect.width)}px`
    }
  }
}
