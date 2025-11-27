import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import SonnerController from "../../../../app/javascript/ui/controllers/sonner_controller.js"

describe("SonnerController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--sonner", SonnerController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createSonner(options = {}) {
    const {
      position = "bottom-right",
      theme = "system",
      richColors = false,
      duration = 4000,
      closeButton = false,
      visibleToasts = 3
    } = options

    return `
      <ol data-controller="ui--sonner"
          data-ui--sonner-position-value="${position}"
          data-ui--sonner-theme-value="${theme}"
          data-ui--sonner-rich-colors-value="${richColors}"
          data-ui--sonner-duration-value="${duration}"
          data-ui--sonner-close-button-value="${closeButton}"
          data-ui--sonner-visible-toasts-value="${visibleToasts}"
          data-testid="sonner">
      </ol>
    `
  }

  describe("Initialization", () => {
    test("connects successfully", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      expect(controller).not.toBeNull()
    })

    test("respects position value", async () => {
      container.innerHTML = createSonner({ position: "top-center" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      expect(controller.positionValue).toBe("top-center")
    })

    test("sets up container attributes", async () => {
      container.innerHTML = createSonner({ position: "bottom-right" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')

      expect(element.getAttribute("data-sonner-toaster")).toBe("")
      expect(element.getAttribute("data-y-position")).toBe("bottom")
      expect(element.getAttribute("data-x-position")).toBe("right")
    })

    test("initializes with empty toasts array", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      expect(controller.toasts).toBeInstanceOf(Array)
      expect(controller.toasts.length).toBe(0)
    })

    test("initializes with isHovered false", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      expect(controller.isHovered).toBe(false)
    })
  })

  describe("Show Toast", () => {
    test("show creates a toast element", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      const id = controller.show("Test message")
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(id).toBe(1)
      expect(controller.toasts.length).toBe(1)
    })

    test("show adds toast to DOM", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.show("Test message")
      await new Promise(resolve => setTimeout(resolve, 10))

      const toasts = element.querySelectorAll("[data-sonner-toast]")
      expect(toasts.length).toBe(1)
    })

    test("show with type sets data-type attribute", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.show("Success!", { type: "success" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const toast = element.querySelector("[data-sonner-toast]")
      expect(toast.getAttribute("data-type")).toBe("success")
    })

    test("increments toast ID for each new toast", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      const id1 = controller.show("First")
      const id2 = controller.show("Second")
      const id3 = controller.show("Third")

      expect(id1).toBe(1)
      expect(id2).toBe(2)
      expect(id3).toBe(3)
    })
  })

  describe("Toast Types", () => {
    test("success type creates success toast", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.success({ params: { message: "Success!" } })
      await new Promise(resolve => setTimeout(resolve, 10))

      const toast = element.querySelector("[data-sonner-toast]")
      expect(toast.getAttribute("data-type")).toBe("success")
    })

    test("error type creates error toast", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.error({ params: { message: "Error!" } })
      await new Promise(resolve => setTimeout(resolve, 10))

      const toast = element.querySelector("[data-sonner-toast]")
      expect(toast.getAttribute("data-type")).toBe("error")
    })

    test("info type creates info toast", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.info({ params: { message: "Info!" } })
      await new Promise(resolve => setTimeout(resolve, 10))

      const toast = element.querySelector("[data-sonner-toast]")
      expect(toast.getAttribute("data-type")).toBe("info")
    })

    test("warning type creates warning toast", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.warning({ params: { message: "Warning!" } })
      await new Promise(resolve => setTimeout(resolve, 10))

      const toast = element.querySelector("[data-sonner-toast]")
      expect(toast.getAttribute("data-type")).toBe("warning")
    })
  })

  describe("Dismiss", () => {
    test("dismiss marks toast as removed", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      const id = controller.show("Test message")
      await new Promise(resolve => setTimeout(resolve, 10))

      controller.dismiss(id)
      await new Promise(resolve => setTimeout(resolve, 10))

      const toast = element.querySelector("[data-sonner-toast]")
      expect(toast.getAttribute("data-removed")).toBe("true")
    })

    test("dismissAll marks all toasts as removed", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.show("First")
      controller.show("Second")
      controller.show("Third")
      await new Promise(resolve => setTimeout(resolve, 10))

      controller.dismissAll()
      await new Promise(resolve => setTimeout(resolve, 10))

      const toasts = element.querySelectorAll("[data-sonner-toast]")
      toasts.forEach(toast => {
        expect(toast.getAttribute("data-removed")).toBe("true")
      })
    })
  })

  describe("Global Event Listener", () => {
    test("responds to ui:toast event", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      document.dispatchEvent(new CustomEvent("ui:toast", {
        detail: { message: "Event toast", type: "success" }
      }))
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.toasts.length).toBe(1)
    })

    test("ignores ui:toast event without message", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      document.dispatchEvent(new CustomEvent("ui:toast", {
        detail: { type: "success" }
      }))
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.toasts.length).toBe(0)
    })
  })

  describe("Hover Behavior", () => {
    test("handleMouseEnter sets isHovered to true", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.handleMouseEnter()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.isHovered).toBe(true)
    })

    test("handleMouseLeave sets isHovered to false", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.handleMouseEnter()
      controller.handleMouseLeave()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.isHovered).toBe(false)
    })

    test("handleMouseEnter expands toasts", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.show("Test")
      await new Promise(resolve => setTimeout(resolve, 10))

      // handleMouseEnter sets isHovered and calls expandToasts
      controller.handleMouseEnter()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Check that the toast has data-expanded set to true
      expect(controller.toasts[0].element.getAttribute("data-expanded")).toBe("true")
    })

    test("collapseToasts sets data-expanded to false", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      controller.show("Test")
      await new Promise(resolve => setTimeout(resolve, 10))

      controller.expandToasts()
      controller.collapseToasts()
      await new Promise(resolve => setTimeout(resolve, 10))

      const toast = element.querySelector("[data-sonner-toast]")
      expect(toast.getAttribute("data-expanded")).toBe("false")
    })
  })

  describe("Disconnect", () => {
    test("cleans up event listeners on disconnect", async () => {
      container.innerHTML = createSonner()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sonner"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sonner")

      // Should not throw
      controller.disconnect()
    })
  })
})
