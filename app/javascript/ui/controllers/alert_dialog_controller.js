import { Controller } from "@hotwired/stimulus"

// Alert Dialog controller for important confirmations
// Similar to Dialog but requires explicit action (no click-outside to close)
export default class extends Controller {
  static targets = ["container", "overlay", "content"]
  static values = {
    open: { type: Boolean, default: false },
    closeOnEscape: { type: Boolean, default: true }
  }

  connect() {
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
    // Set data-state to open for animations
    // Never use .hidden - pointer-events and animations control visibility
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("data-state", "open")
    }

    if (this.hasOverlayTarget) {
      this.overlayTarget.setAttribute("data-state", "open")
    }
    if (this.hasContentTarget) {
      this.contentTarget.setAttribute("data-state", "open")
    }

    document.body.style.overflow = "hidden"

    this.setupFocusTrap()

    if (this.closeOnEscapeValue) {
      this.escapeHandler = (e) => {
        if (e.key === "Escape") {
          this.close()
        }
      }
      document.addEventListener("keydown", this.escapeHandler)
    }

    this.element.dispatchEvent(new CustomEvent("alertdialog:open", {
      bubbles: true,
      detail: { open: true }
    }))
  }

  hide() {
    // Set data-state to closed to trigger exit animations
    // CSS pointer-events-none and animations handle visibility
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("data-state", "closed")
    }

    if (this.hasOverlayTarget) {
      this.overlayTarget.setAttribute("data-state", "closed")
    }

    if (this.hasContentTarget) {
      this.contentTarget.setAttribute("data-state", "closed")
    }

    document.body.style.overflow = ""

    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler)
      this.escapeHandler = null
    }

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

  setupFocusTrap() {
    if (!this.hasContentTarget) return

    const focusableElements = this.contentTarget.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }

  disconnect() {
    document.body.style.overflow = ""
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler)
    }
  }
}
