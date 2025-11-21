import { Controller } from "@hotwired/stimulus"

// Command Dialog controller
// Opens a command palette dialog with keyboard shortcut (default: Cmd/Ctrl+J)
// Uses Stimulus keyboard event filter: https://stimulus.hotwired.dev/reference/actions#keyboardevent-filter
export default class extends Controller {
  static values = {
    shortcut: { type: String, default: "meta+j" }
  }

  connect() {
    // Find the nested dialog controller
    this.dialogElement = this.element.querySelector("[data-controller*='ui--dialog']")

    // Listen for dialog close events to clear input
    this.element.addEventListener("dialog:close", this.handleDialogClose.bind(this))
  }

  disconnect() {
    this.element.removeEventListener("dialog:close", this.handleDialogClose.bind(this))
  }

  handleDialogClose() {
    this.clearInput()
  }

  toggle(event) {
    event.preventDefault()

    if (!this.dialogElement) return

    // Get the dialog controller instance
    const dialogController = this.application.getControllerForElementAndIdentifier(
      this.dialogElement,
      "ui--dialog"
    )

    if (dialogController) {
      if (dialogController.openValue) {
        dialogController.close()
      } else {
        dialogController.open()
        // Focus the command input after opening
        this.focusInput()
      }
    }
  }

  focusInput() {
    // Small delay to ensure dialog is open and animations started
    setTimeout(() => {
      const input = this.element.querySelector("[data-ui--command-target='input']")
      if (input) {
        input.focus()
        input.select()
      }
    }, 50)
  }

  clearInput() {
    const input = this.element.querySelector("[data-ui--command-target='input']")
    if (input) {
      input.value = ""
      // Trigger input event to reset filtering
      input.dispatchEvent(new Event("input", { bubbles: true }))
    }
  }
}
