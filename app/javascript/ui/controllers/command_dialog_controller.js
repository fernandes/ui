import { Controller } from "@hotwired/stimulus"

// Command Dialog controller
// Opens a command palette dialog with a keyboard shortcut (default: Cmd+J).
// Uses Stimulus keyboard event filter: https://stimulus.hotwired.dev/reference/actions#keyboardevent-filter
//
// The nested ui--dialog controller does the modal work: focus trap, inert
// page, Escape layer and focus restore on close. This controller only toggles
// it, makes the search input the initial focus and clears the search on close.
export default class extends Controller {
  static values = {
    shortcut: { type: String, default: "meta+j" }
  }

  constructor() {
    super(...arguments)
  }

  connect() {
    this.dialogElement = this.element.querySelector("[data-controller~='ui--dialog']")

    this.handleDialogClose = this.handleDialogClose.bind(this)
    this.element.addEventListener("dialog:close", this.handleDialogClose)
  }

  disconnect() {
    this.element.removeEventListener("dialog:close", this.handleDialogClose)
  }

  get dialogController() {
    if (!this.dialogElement) return null
    return this.application.getControllerForElementAndIdentifier(this.dialogElement, "ui--dialog")
  }

  get input() {
    return this.element.querySelector("[data-ui--command-target='input']")
  }

  get commandAutofocus() {
    const command = this.input?.closest("[data-controller~='ui--command']")
    return command?.getAttribute("data-ui--command-autofocus-value") !== "false"
  }

  toggle(event) {
    event.preventDefault()

    const dialog = this.dialogController
    if (!dialog) return

    if (dialog.openValue) {
      dialog.close()
    } else {
      // The dialog's initial focus honours [autofocus] (also on mobile, where
      // it otherwise skips text inputs), so the palette opens on its search
      // field without a timer
      if (this.commandAutofocus) this.input?.setAttribute("autofocus", "")
      dialog.open()
    }
  }

  handleDialogClose() {
    // Only needed while open; don't leave an [autofocus] for Turbo to find
    this.input?.removeAttribute("autofocus")
    this.clearInput()
  }

  clearInput() {
    const input = this.input
    if (input) {
      input.value = ""
      // Trigger input event to reset filtering
      input.dispatchEvent(new Event("input", { bubbles: true }))
    }
  }
}
