import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"
import { createEscapeKeyHandler } from "../utils/escape-key-manager.js"
import { focusFirstElement } from "../utils/focus-trap-manager.js"
import { lockScroll, unlockScroll } from "../utils/scroll-lock-manager.js"

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
    // Setup escape key handler
    this.escapeHandler = createEscapeKeyHandler(() => this.close(), {
      enabled: this.closeOnEscapeValue
    })

    if (this.openValue) {
      this.show()
    } else {
      this.setInitialClosedState()
    }
  }

  setInitialClosedState() {
    // Set initial closed state with data-initial to prevent exit animations on page load
    const targets = [
      this.hasContainerTarget ? this.containerTarget : null,
      this.hasOverlayTarget ? this.overlayTarget : null,
      this.hasContentTarget ? this.contentTarget : null
    ].filter(Boolean)

    targets.forEach(target => {
      setState(target, 'closed')
      target.setAttribute("data-initial", "")
    })
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
    // Remove data-initial and set open state
    const targets = [
      this.hasContainerTarget ? this.containerTarget : null,
      this.hasOverlayTarget ? this.overlayTarget : null,
      this.hasContentTarget ? this.contentTarget : null
    ].filter(Boolean)

    targets.forEach(target => {
      target.removeAttribute("data-initial")
      setState(target, 'open')
    })

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

    this.element.dispatchEvent(new CustomEvent("dialog:open", {
      bubbles: true,
      detail: { open: true }
    }))
  }

  hide() {
    // Set closed state for exit animations
    const targets = [
      this.hasContainerTarget ? this.containerTarget : null,
      this.hasOverlayTarget ? this.overlayTarget : null,
      this.hasContentTarget ? this.contentTarget : null
    ].filter(Boolean)

    targets.forEach(target => {
      setState(target, 'closed')
    })

    // Unlock body scroll
    unlockScroll()

    // Detach escape handler
    this.escapeHandler.detach()

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

  disconnect() {
    unlockScroll()
    this.escapeHandler.detach()
  }
}
