import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import AlertDialogController from "../../../../app/javascript/ui/controllers/alert_dialog_controller.js"

describe("AlertDialogController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--alert-dialog", AlertDialogController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
    document.body.style.overflow = ""
  })

  // Helper to create basic alert dialog HTML
  function createAlertDialog(options = {}) {
    const {
      open = false,
      closeOnEscape = true
    } = options

    return `
      <div data-controller="ui--alert-dialog"
           data-ui--alert-dialog-open-value="${open}"
           data-ui--alert-dialog-close-on-escape-value="${closeOnEscape}">
        <button data-action="click->ui--alert-dialog#open" data-testid="trigger">
          Delete Item
        </button>
        <div data-ui--alert-dialog-target="container" data-state="closed">
          <div data-ui--alert-dialog-target="overlay"
               data-action="click->ui--alert-dialog#preventOverlayClose"
               data-testid="overlay">
          </div>
          <div data-ui--alert-dialog-target="content"
               role="alertdialog"
               aria-modal="true"
               aria-labelledby="alert-title"
               aria-describedby="alert-description"
               data-testid="content">
            <h2 id="alert-title">Are you sure?</h2>
            <p id="alert-description">This action cannot be undone.</p>
            <button data-action="click->ui--alert-dialog#close" data-testid="cancel-button">Cancel</button>
            <button data-action="click->ui--alert-dialog#close" data-testid="confirm-button">Delete</button>
          </div>
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--alert-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--alert-dialog")

      expect(controller).not.toBeNull()
      expect(controller.openValue).toBe(false)
      expect(controller.closeOnEscapeValue).toBe(true)
    })

    test("opens immediately when open value is true", async () => {
      container.innerHTML = createAlertDialog({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--alert-dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("open")
    })
  })

  describe("Open/Close", () => {
    test("opens alert dialog when trigger clicked", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--alert-dialog-target="container"]')
      const overlay = container.querySelector('[data-ui--alert-dialog-target="overlay"]')
      const content = container.querySelector('[data-ui--alert-dialog-target="content"]')

      expect(dialogContainer.getAttribute("data-state")).toBe("open")
      expect(overlay.getAttribute("data-state")).toBe("open")
      expect(content.getAttribute("data-state")).toBe("open")
    })

    test("closes alert dialog when cancel button clicked", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open first
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Close via cancel
      const cancelButton = container.querySelector('[data-testid="cancel-button"]')
      cancelButton.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--alert-dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("closed")
    })

    test("closes alert dialog when confirm button clicked", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open first
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Close via confirm
      const confirmButton = container.querySelector('[data-testid="confirm-button"]')
      confirmButton.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--alert-dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("closed")
    })

    test("locks body scroll when open", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("")

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("hidden")
    })

    test("restores body scroll when closed", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("hidden")

      const cancelButton = container.querySelector('[data-testid="cancel-button"]')
      cancelButton.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("")
    })
  })

  describe("Overlay click prevention", () => {
    test("does NOT close when clicking overlay (unlike regular Dialog)", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open alert dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--alert-dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("open")

      // Click overlay - should NOT close (important for destructive actions)
      const overlay = container.querySelector('[data-testid="overlay"]')
      overlay.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Alert dialog should still be open
      expect(dialogContainer.getAttribute("data-state")).toBe("open")
    })
  })

  describe("Keyboard interactions", () => {
    test("closes on Escape key when enabled", async () => {
      container.innerHTML = createAlertDialog({ closeOnEscape: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open alert dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--alert-dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("open")

      // Press Escape
      const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(dialogContainer.getAttribute("data-state")).toBe("closed")
    })

    test("does not close on Escape when disabled", async () => {
      container.innerHTML = createAlertDialog({ closeOnEscape: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open alert dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--alert-dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("open")

      // Press Escape
      const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Alert dialog should still be open
      expect(dialogContainer.getAttribute("data-state")).toBe("open")
    })
  })

  describe("Focus management", () => {
    test("focuses first focusable element when opened", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const cancelButton = container.querySelector('[data-testid="cancel-button"]')
      expect(document.activeElement).toBe(cancelButton)
    })
  })

  describe("Events", () => {
    test("dispatches alertdialog:open event when opened", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      let eventFired = false
      let eventDetail = null
      const element = container.querySelector('[data-controller="ui--alert-dialog"]')
      element.addEventListener("alertdialog:open", (e) => {
        eventFired = true
        eventDetail = e.detail
      })

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
      expect(eventDetail.open).toBe(true)
    })

    test("dispatches alertdialog:close event when closed", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open first
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      let eventFired = false
      let eventDetail = null
      const element = container.querySelector('[data-controller="ui--alert-dialog"]')
      element.addEventListener("alertdialog:close", (e) => {
        eventFired = true
        eventDetail = e.detail
      })

      // Close
      const cancelButton = container.querySelector('[data-testid="cancel-button"]')
      cancelButton.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
      expect(eventDetail.open).toBe(false)
    })
  })

  describe("Disconnect", () => {
    test("restores body overflow on disconnect", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open alert dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("hidden")

      // Get controller and call disconnect directly
      const element = container.querySelector('[data-controller="ui--alert-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--alert-dialog")
      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("")
    })

    test("removes escape handler on disconnect", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open alert dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Get controller and call disconnect directly
      const element = container.querySelector('[data-controller="ui--alert-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--alert-dialog")
      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      // This should not throw an error
      const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(event)
    })
  })

  describe("ARIA attributes", () => {
    test("has correct ARIA attributes for accessibility", async () => {
      container.innerHTML = createAlertDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-ui--alert-dialog-target="content"]')

      expect(content.getAttribute("role")).toBe("alertdialog")
      expect(content.getAttribute("aria-modal")).toBe("true")
      expect(content.getAttribute("aria-labelledby")).toBe("alert-title")
      expect(content.getAttribute("aria-describedby")).toBe("alert-description")
    })
  })
})
