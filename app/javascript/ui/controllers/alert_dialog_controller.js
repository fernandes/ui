import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"
import { createEscapeKeyHandler } from "../utils/escape-key-manager.js"
import { focusFirstElement } from "../utils/focus-trap-manager.js"
import { lockScroll, unlockScroll } from "../utils/scroll-lock-manager.js"

// Alert Dialog controller for important confirmations
// Similar to Dialog but requires explicit action (no click-outside to close)
export default class extends Controller {
  static targets = ["container", "overlay", "content"]
  static values = {
    open: { type: Boolean, default: false },
    closeOnEscape: { type: Boolean, default: true }
  }

  connect() {
    // Setup escape key handler
    this.escapeHandler = createEscapeKeyHandler(() => this.close(), {
      enabled: this.closeOnEscapeValue
    })

    if (this.openValue) {
      this.show()
    }
  }

  open() {
    this.openValue = true
    this.show()
  }

  close() {
    this.openValue = false
    this.hide()
  }

  show() {
    // Set open state on all targets
    const targets = [
      this.hasContainerTarget ? this.containerTarget : null,
      this.hasOverlayTarget ? this.overlayTarget : null,
      this.hasContentTarget ? this.contentTarget : null
    ].filter(Boolean)

    targets.forEach(target => setState(target, 'open'))

    // Lock body scroll
    lockScroll()

    // Setup focus trap
    if (this.hasContentTarget) {
      focusFirstElement(this.contentTarget)
    }

    // Attach escape handler
    if (this.closeOnEscapeValue) {
      this.escapeHandler.attach()
    }

    this.element.dispatchEvent(new CustomEvent("alertdialog:open", {
      bubbles: true,
      detail: { open: true }
    }))
  }

  hide() {
    // Set closed state on all targets
    const targets = [
      this.hasContainerTarget ? this.containerTarget : null,
      this.hasOverlayTarget ? this.overlayTarget : null,
      this.hasContentTarget ? this.contentTarget : null
    ].filter(Boolean)

    targets.forEach(target => setState(target, 'closed'))

    // Unlock body scroll
    unlockScroll()

    // Detach escape handler
    this.escapeHandler.detach()

    this.element.dispatchEvent(new CustomEvent("alertdialog:close", {
      bubbles: true,
      detail: { open: false }
    }))
  }

  // Alert dialogs should NOT close when clicking overlay (important for destructive actions)
  // This is intentionally different from regular Dialog
  preventOverlayClose(event) {
    event.stopPropagation()
  }

  disconnect() {
    unlockScroll()
    this.escapeHandler.detach()
  }
}
