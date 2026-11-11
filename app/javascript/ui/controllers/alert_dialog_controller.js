import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"
import { ensureId, setIdRefs } from "../utils/id-manager.js"
import { createModalSession } from "../utils/modal-session.js"

// Alert Dialog controller for important confirmations.
// Like Dialog, but requires an explicit choice: clicking the overlay never
// closes it (Radix AlertDialog).
//
// While open (WAI-ARIA APG alert dialog):
// - focus starts on Cancel (the least destructive choice), Tab is trapped and
//   the rest of the page is inert
// - Escape closes only the topmost layer; with close_on_escape: false it is
//   swallowed so a dialog below doesn't close either
// - closing returns focus to the trigger
// - content is named/described by its title/description; the trigger button
//   carries aria-haspopup, aria-controls and aria-expanded
export default class extends Controller {
  static targets = ["container", "overlay", "content", "trigger", "title", "description", "cancel"]
  static values = {
    open: { type: Boolean, default: false },
    closeOnEscape: { type: Boolean, default: true }
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
        initialFocus: () => this.hasCancelTarget ? this.cancelTarget : null,
        returnFocus: () => this.triggers[0],
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

  wireAria() {
    if (!this.hasContentTarget) return
    const content = this.contentTarget

    ensureId(content, "alert-dialog-content")
    if (this.hasTitleTarget) setIdRefs(content, "aria-labelledby", this.titleTarget, { prefix: "alert-dialog-title" })
    if (this.hasDescriptionTarget) setIdRefs(content, "aria-describedby", this.descriptionTarget, { prefix: "alert-dialog-description" })

    this.triggers.forEach(trigger => {
      if (!trigger.hasAttribute("aria-haspopup")) trigger.setAttribute("aria-haspopup", "dialog")
      setIdRefs(trigger, "aria-controls", content)
    })
    this.syncTriggers(this.openValue)
  }

  // The elements that really open the dialog. The default Trigger is a
  // wrapper <div> around the caller's button: the ARIA belongs on that button,
  // not on the wrapper. An as_child trigger (or a hand-written one with the
  // open action) is the button itself.
  get triggers() {
    const own = el => el.closest("[data-controller~='ui--alert-dialog']") === this.element
    const byAction = Array.from(this.element.querySelectorAll("[data-action*='ui--alert-dialog#open']")).filter(own)
    const candidates = Array.from(new Set([...this.triggerTargets, ...byAction]))

    return Array.from(new Set(candidates.map(el => this.interactiveElementFor(el)).filter(Boolean)))
  }

  interactiveElementFor(el) {
    if (el.matches("button, a[href], [role='button'], input, select, textarea")) return el
    return el.querySelector("button, a[href], [role='button']")
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
    this.stateTargets.forEach(target => setState(target, "closed"))
    // inert keeps closed content out of the Tab order and the a11y tree
    if (this.hasContentTarget) this.contentTarget.inert = true
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
    this.stateTargets.forEach(target => setState(target, "open"))

    if (this.hasContentTarget) this.contentTarget.inert = false
    this.syncTriggers(true)

    // Content is visible now: trap focus, inert the page, lock scroll, Escape layer
    this.session?.activate()

    this.element.dispatchEvent(new CustomEvent("alertdialog:open", {
      bubbles: true,
      detail: { open: true }
    }))
  }

  hide() {
    // Restores the background and focus before the content goes inert
    this.session?.deactivate()
    this.syncTriggers(false)

    this.stateTargets.forEach(target => setState(target, "closed"))

    if (this.hasContentTarget) this.contentTarget.inert = true

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
}
