import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import DialogController from "../../../../app/javascript/ui/controllers/dialog_controller.js"

describe("DialogController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--dialog", DialogController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
    document.body.style.overflow = ""
  })

  // Helper to create basic dialog HTML
  function createDialog(options = {}) {
    const {
      open = false,
      closeOnEscape = true,
      closeOnOverlayClick = true
    } = options

    return `
      <div data-controller="ui--dialog"
           data-ui--dialog-open-value="${open}"
           data-ui--dialog-close-on-escape-value="${closeOnEscape}"
           data-ui--dialog-close-on-overlay-click-value="${closeOnOverlayClick}">
        <button data-action="click->ui--dialog#open" data-testid="trigger">
          Open Dialog
        </button>
        <div data-ui--dialog-target="container" data-state="closed">
          <div data-ui--dialog-target="overlay"
               data-action="click->ui--dialog#closeOnOverlayClick"
               data-testid="overlay">
          </div>
          <div data-ui--dialog-target="content" role="dialog" aria-modal="true" data-testid="content">
            <button data-testid="first-focusable">First Button</button>
            <input type="text" data-testid="input" />
            <button data-action="click->ui--dialog#close" data-testid="close-button">Close</button>
          </div>
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dialog")

      expect(controller).not.toBeNull()
      expect(controller.openValue).toBe(false)
      expect(controller.closeOnEscapeValue).toBe(true)
      expect(controller.closeOnOverlayClickValue).toBe(true)
    })

    test("starts with closed state and data-initial attribute", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--dialog-target="container"]')
      const overlay = container.querySelector('[data-ui--dialog-target="overlay"]')
      const content = container.querySelector('[data-ui--dialog-target="content"]')

      expect(dialogContainer.getAttribute("data-state")).toBe("closed")
      expect(dialogContainer.hasAttribute("data-initial")).toBe(true)
      expect(overlay.getAttribute("data-state")).toBe("closed")
      expect(overlay.hasAttribute("data-initial")).toBe(true)
      expect(content.getAttribute("data-state")).toBe("closed")
      expect(content.hasAttribute("data-initial")).toBe(true)
    })

    test("opens immediately when open value is true", async () => {
      container.innerHTML = createDialog({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("open")
    })
  })

  describe("Open/Close", () => {
    test("opens dialog when trigger clicked", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--dialog-target="container"]')
      const overlay = container.querySelector('[data-ui--dialog-target="overlay"]')
      const content = container.querySelector('[data-ui--dialog-target="content"]')

      expect(dialogContainer.getAttribute("data-state")).toBe("open")
      expect(overlay.getAttribute("data-state")).toBe("open")
      expect(content.getAttribute("data-state")).toBe("open")
    })

    test("removes data-initial attribute after opening", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--dialog-target="container"]')
      expect(dialogContainer.hasAttribute("data-initial")).toBe(true)

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(dialogContainer.hasAttribute("data-initial")).toBe(false)
    })

    test("closes dialog when close button clicked", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open first
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Close
      const closeButton = container.querySelector('[data-testid="close-button"]')
      closeButton.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("closed")
    })

    test("locks body scroll when open", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("")

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("hidden")
    })

    test("restores body scroll when closed", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("hidden")

      const closeButton = container.querySelector('[data-testid="close-button"]')
      closeButton.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("")
    })
  })

  describe("Keyboard interactions", () => {
    test("closes on Escape key when enabled", async () => {
      container.innerHTML = createDialog({ closeOnEscape: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("open")

      // Press Escape
      const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(dialogContainer.getAttribute("data-state")).toBe("closed")
    })

    test("does not close on Escape when disabled", async () => {
      container.innerHTML = createDialog({ closeOnEscape: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("open")

      // Press Escape
      const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(dialogContainer.getAttribute("data-state")).toBe("open")
    })
  })

  describe("Overlay click", () => {
    test("closes when clicking overlay when enabled", async () => {
      container.innerHTML = createDialog({ closeOnOverlayClick: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("open")

      // Click overlay
      const overlay = container.querySelector('[data-testid="overlay"]')
      overlay.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(dialogContainer.getAttribute("data-state")).toBe("closed")
    })

    test("does not close when clicking overlay when disabled", async () => {
      container.innerHTML = createDialog({ closeOnOverlayClick: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const dialogContainer = container.querySelector('[data-ui--dialog-target="container"]')
      expect(dialogContainer.getAttribute("data-state")).toBe("open")

      // Click overlay
      const overlay = container.querySelector('[data-testid="overlay"]')
      overlay.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(dialogContainer.getAttribute("data-state")).toBe("open")
    })
  })

  describe("Focus management", () => {
    test("focuses first focusable element when opened", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const firstFocusable = container.querySelector('[data-testid="first-focusable"]')
      expect(document.activeElement).toBe(firstFocusable)
    })
  })

  describe("Events", () => {
    test("dispatches dialog:open event when opened", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      let eventFired = false
      let eventDetail = null
      const element = container.querySelector('[data-controller="ui--dialog"]')
      element.addEventListener("dialog:open", (e) => {
        eventFired = true
        eventDetail = e.detail
      })

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
      expect(eventDetail.open).toBe(true)
    })

    test("dispatches dialog:close event when closed", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open first
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      let eventFired = false
      let eventDetail = null
      const element = container.querySelector('[data-controller="ui--dialog"]')
      element.addEventListener("dialog:close", (e) => {
        eventFired = true
        eventDetail = e.detail
      })

      // Close
      const closeButton = container.querySelector('[data-testid="close-button"]')
      closeButton.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
      expect(eventDetail.open).toBe(false)
    })
  })

  describe("Disconnect", () => {
    test("restores body overflow on disconnect", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("hidden")

      // Get controller and call disconnect directly
      const element = container.querySelector('[data-controller="ui--dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dialog")
      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.body.style.overflow).toBe("")
    })

    test("removes escape handler on disconnect", async () => {
      container.innerHTML = createDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open dialog
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Get controller and call disconnect directly
      const element = container.querySelector('[data-controller="ui--dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--dialog")
      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      // This should not throw an error
      const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(event)
    })
  })
})
