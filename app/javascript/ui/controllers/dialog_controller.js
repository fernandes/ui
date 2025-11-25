import { Controller } from "@hotwired/stimulus"

// Dialog controller for general-purpose modal dialogs
// Unlike AlertDialog, this DOES close when clicking overlay or pressing Escape
export default class extends Controller {
  static targets = ["container", "overlay", "content"]
  static values = {
    open: { type: Boolean, default: false },
    closeOnEscape: { type: Boolean, default: true },
    closeOnOverlayClick: { type: Boolean, default: true }
  }

  connect() {
    if (this.openValue) {
      this.show()
    } else {
      // Set initial closed state with data-initial to prevent exit animations on page load
      if (this.hasContainerTarget) {
        this.containerTarget.setAttribute("data-state", "closed")
        this.containerTarget.setAttribute("data-initial", "")
      }
      if (this.hasOverlayTarget) {
        this.overlayTarget.setAttribute("data-state", "closed")
        this.overlayTarget.setAttribute("data-initial", "")
      }
      if (this.hasContentTarget) {
        this.contentTarget.setAttribute("data-state", "closed")
        this.contentTarget.setAttribute("data-initial", "")
      }
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
    // Remove data-initial to enable exit animations after first open
    if (this.hasContainerTarget) {
      this.containerTarget.removeAttribute("data-initial")
      this.containerTarget.setAttribute("data-state", "open")
    }

    if (this.hasOverlayTarget) {
      this.overlayTarget.removeAttribute("data-initial")
      this.overlayTarget.setAttribute("data-state", "open")
    }
    if (this.hasContentTarget) {
      this.contentTarget.removeAttribute("data-initial")
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

    this.element.dispatchEvent(new CustomEvent("dialog:open", {
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

    this.element.dispatchEvent(new CustomEvent("dialog:close", {
      bubbles: true,
      detail: { open: false }
    }))
  }

  // Regular dialogs CAN close when clicking overlay (unlike AlertDialog)
  closeOnOverlayClick(event) {
    if (this.closeOnOverlayClickValue) {
      this.close()
    }
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
