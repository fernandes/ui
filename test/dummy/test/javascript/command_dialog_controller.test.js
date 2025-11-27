import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import CommandDialogController from "../../../../app/javascript/ui/controllers/command_dialog_controller.js"
import DialogController from "../../../../app/javascript/ui/controllers/dialog_controller.js"

describe("CommandDialogController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--command-dialog", CommandDialogController)
    application.register("ui--dialog", DialogController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createCommandDialog(options = {}) {
    const { shortcut = "meta+j" } = options

    return `
      <div data-controller="ui--command-dialog"
           data-ui--command-dialog-shortcut-value="${shortcut}"
           data-testid="command-dialog">
        <div data-controller="ui--dialog"
             data-ui--dialog-open-value="false"
             data-testid="dialog">
          <div data-ui--dialog-target="container"
               data-state="closed"
               data-testid="container">
            <div data-ui--dialog-target="content" data-testid="content">
              <input data-ui--command-target="input" data-testid="input" />
            </div>
          </div>
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects successfully", async () => {
      container.innerHTML = createCommandDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command-dialog")

      expect(controller).not.toBeNull()
    })

    test("finds dialog element", async () => {
      container.innerHTML = createCommandDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command-dialog")

      expect(controller.dialogElement).not.toBeNull()
    })

    test("has shortcut value", async () => {
      container.innerHTML = createCommandDialog({ shortcut: "meta+k" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command-dialog")

      expect(controller.shortcutValue).toBe("meta+k")
    })
  })

  describe("Toggle", () => {
    test("toggle opens dialog when closed", async () => {
      container.innerHTML = createCommandDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command-dialog")
      const dialogElement = container.querySelector('[data-testid="dialog"]')
      const dialogController = application.getControllerForElementAndIdentifier(dialogElement, "ui--dialog")

      const mockEvent = { preventDefault: () => {} }
      controller.toggle(mockEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(dialogController.openValue).toBe(true)
    })

    test("toggle closes dialog when open", async () => {
      container.innerHTML = createCommandDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command-dialog")
      const dialogElement = container.querySelector('[data-testid="dialog"]')
      const dialogController = application.getControllerForElementAndIdentifier(dialogElement, "ui--dialog")

      // Open first
      dialogController.openValue = true

      const mockEvent = { preventDefault: () => {} }
      controller.toggle(mockEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(dialogController.openValue).toBe(false)
    })
  })

  describe("Clear Input", () => {
    test("clearInput clears the input value", async () => {
      container.innerHTML = createCommandDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command-dialog")
      const input = container.querySelector('[data-testid="input"]')

      input.value = "test query"
      controller.clearInput()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(input.value).toBe("")
    })
  })

  describe("Disconnect", () => {
    test("cleans up on disconnect", async () => {
      container.innerHTML = createCommandDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command-dialog")

      // Should not throw
      controller.disconnect()
    })
  })
})
