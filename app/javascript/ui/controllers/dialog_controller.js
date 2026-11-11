import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"
import { ensureId, setIdRefs } from "../utils/id-manager.js"
import { createModalSession } from "../utils/modal-session.js"

// Dialog controller for general-purpose modal dialogs (also drives Sheet).
// Unlike AlertDialog, this DOES close when clicking overlay or pressing Escape.
//
// While open (Radix Dialog / WAI-ARIA APG modal dialog):
// - focus moves inside, Tab is trapped, the rest of the page is inert
// - Escape closes only the topmost layer (nested dialogs, selects, ...)
// - closing returns focus to the element that opened it
// - content is named/described by its title/description; triggers carry
//   aria-haspopup, aria-controls and aria-expanded
export default class extends Controller {
  static targets = ["container", "overlay", "content", "trigger", "title", "description"]
  static values = {
    open: { type: Boolean, default: false },
    closeOnEscape: { type: Boolean, default: true },
    closeOnOverlayClick: { type: Boolean, default: true }
  }

  constructor() {
    super(...arguments)
  }

  connect() {
    this.wireAria()

    if (this.hasContentTarget) {
      this.session = createModalSession({
        content: this.contentTarget,
        isolate: this.hasContainerTarget ? this.containerTarget : this.contentTarget,
        returnFocus: () => this.triggers[0],
        // A dialog that ignores Escape still claims it, so a dialog below stays open
        onEscape: () => { if (this.closeOnEscapeValue) this.close() }
      })
    }

    if (this.openValue) {
      this.show()
    } else {
      this.setInitialClosedState()
    }
  }

  disconnect() {
    this.session?.deactivate({ restoreFocus: false })
  }

  // Ids are wired on the client so ERB, Phlex and ViewComponent share one
  // implementation; an id the author rendered is kept.
  wireAria() {
    if (!this.hasContentTarget) return
    const content = this.contentTarget

    ensureId(content, "dialog-content")
    if (this.hasTitleTarget) setIdRefs(content, "aria-labelledby", this.titleTarget, { prefix: "dialog-title" })
    if (this.hasDescriptionTarget) setIdRefs(content, "aria-describedby", this.descriptionTarget, { prefix: "dialog-description" })

    this.triggers.forEach(trigger => {
      if (!trigger.hasAttribute("aria-haspopup")) trigger.setAttribute("aria-haspopup", "dialog")
      setIdRefs(trigger, "aria-controls", content)
    })
    this.syncTriggers(this.openValue)
  }

  // Trigger targets, plus hand-written triggers that only carry the action
  get triggers() {
    const own = el => el.closest("[data-controller~='ui--dialog']") === this.element
    const byAction = Array.from(this.element.querySelectorAll("[data-action*='ui--dialog#open']")).filter(own)
    return Array.from(new Set([...this.triggerTargets, ...byAction]))
  }

  syncTriggers(open) {
    this.triggers.forEach(trigger => trigger.setAttribute("aria-expanded", open ? "true" : "false"))
  }

  get stateTargets() {
    return [
      this.hasContainerTarget ? this.containerTarget : null,
      this.hasOverlayTarget ? this.overlayTarget : null,
      this.hasContentTarget ? this.contentTarget : null
    ].filter(Boolean)
  }

  setInitialClosedState() {
    // data-initial prevents exit animations on page load
    this.stateTargets.forEach(target => {
      setState(target, "closed")
      target.setAttribute("data-initial", "")
    })

    // inert keeps closed content out of the Tab order and the a11y tree
    if (this.hasContentTarget) {
      this.contentTarget.inert = true
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
    this.stateTargets.forEach(target => {
      target.removeAttribute("data-initial")
      setState(target, "open")
    })

    if (this.hasContentTarget) {
      this.contentTarget.inert = false
    }
    this.syncTriggers(true)

    // Content is visible now: trap focus, inert the page, lock scroll, Escape layer
    this.session?.activate()

    this.element.dispatchEvent(new CustomEvent("dialog:open", {
      bubbles: true,
      detail: { open: true }
    }))
  }

  hide() {
    // Restores the background and focus before the content goes inert
    this.session?.deactivate()
    this.syncTriggers(false)

    this.stateTargets.forEach(target => {
      setState(target, "closed")
    })

    if (this.hasContentTarget) {
      this.contentTarget.inert = true
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
}
