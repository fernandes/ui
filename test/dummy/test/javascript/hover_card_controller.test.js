import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import HoverCardController from "../../../../app/javascript/ui/controllers/hover_card_controller.js"

describe("HoverCardController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--hover-card", HoverCardController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createHoverCard(options = {}) {
    const { align = "center", sideOffset = 4, openDelay = 200, closeDelay = 300 } = options

    return `
      <div data-controller="ui--hover-card"
           data-ui--hover-card-align-value="${align}"
           data-ui--hover-card-side-offset-value="${sideOffset}"
           data-ui--hover-card-open-delay-value="${openDelay}"
           data-ui--hover-card-close-delay-value="${closeDelay}">
        <a data-ui--hover-card-target="trigger"
           data-action="mouseenter->ui--hover-card#show mouseleave->ui--hover-card#hide"
           data-testid="trigger"
           href="#">
          Hover Me
        </a>
        <div data-ui--hover-card-target="content"
             data-state="closed"
             class="invisible"
             data-testid="content">
          <p>Hover card content</p>
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createHoverCard()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")

      expect(controller).not.toBeNull()
      expect(controller.openValue).toBe(false)
      expect(controller.alignValue).toBe("center")
      expect(controller.sideOffsetValue).toBe(4)
      expect(controller.openDelayValue).toBe(200)
      expect(controller.closeDelayValue).toBe(300)
    })

    test("sets content to fixed position on connect", async () => {
      container.innerHTML = createHoverCard()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.style.position).toBe("fixed")
    })

    test("starts closed by default", async () => {
      container.innerHTML = createHoverCard()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("closed")
      expect(content.classList.contains("invisible")).toBe(true)
    })
  })

  describe("Show", () => {
    test("opens after delay", async () => {
      container.innerHTML = createHoverCard({ openDelay: 50 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")
      const content = container.querySelector('[data-testid="content"]')

      controller.show()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(content.getAttribute("data-state")).toBe("open")
      expect(content.classList.contains("visible")).toBe(true)
      expect(content.classList.contains("invisible")).toBe(false)
    })

    test("sets openValue to true", async () => {
      container.innerHTML = createHoverCard({ openDelay: 10 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")

      controller.show()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(controller.openValue).toBe(true)
    })
  })

  describe("Hide", () => {
    test("closes after delay", async () => {
      container.innerHTML = createHoverCard({ openDelay: 10, closeDelay: 50 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")
      const content = container.querySelector('[data-testid="content"]')

      // Open first
      controller.show()
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(content.getAttribute("data-state")).toBe("open")

      // Then close
      controller.hide()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(content.getAttribute("data-state")).toBe("closed")
      expect(content.classList.contains("invisible")).toBe(true)
    })

    test("sets openValue to false", async () => {
      container.innerHTML = createHoverCard({ openDelay: 10, closeDelay: 10 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")

      controller.show()
      await new Promise(resolve => setTimeout(resolve, 50))

      controller.hide()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(controller.openValue).toBe(false)
    })
  })

  describe("Keep Open", () => {
    test("keepOpen clears timeouts", async () => {
      container.innerHTML = createHoverCard({ openDelay: 10, closeDelay: 100 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")
      const content = container.querySelector('[data-testid="content"]')

      // Open
      controller.show()
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(content.getAttribute("data-state")).toBe("open")

      // Start hiding
      controller.hide()

      // Immediately keep open (simulating hover on content)
      controller.keepOpen()

      // Wait past close delay
      await new Promise(resolve => setTimeout(resolve, 150))

      // Should still be open
      expect(content.getAttribute("data-state")).toBe("open")
    })
  })

  describe("Schedule Hide", () => {
    test("scheduleHide calls hide", async () => {
      container.innerHTML = createHoverCard({ openDelay: 10, closeDelay: 10 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")
      const content = container.querySelector('[data-testid="content"]')

      controller.show()
      await new Promise(resolve => setTimeout(resolve, 50))

      controller.scheduleHide()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(content.getAttribute("data-state")).toBe("closed")
    })
  })

  describe("Timeouts", () => {
    test("clearTimeouts clears both timeouts", async () => {
      container.innerHTML = createHoverCard({ openDelay: 500, closeDelay: 500 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")
      const content = container.querySelector('[data-testid="content"]')

      controller.show()
      controller.clearTimeouts()

      // Wait past open delay
      await new Promise(resolve => setTimeout(resolve, 600))

      // Should still be closed because timeout was cleared
      expect(content.getAttribute("data-state")).toBe("closed")
    })

    test("calling show cancels pending hide", async () => {
      container.innerHTML = createHoverCard({ openDelay: 10, closeDelay: 200 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")
      const content = container.querySelector('[data-testid="content"]')

      // Open
      controller.show()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Start hiding
      controller.hide()

      // Before hide completes, show again
      controller.show()
      await new Promise(resolve => setTimeout(resolve, 250))

      // Should still be open
      expect(content.getAttribute("data-state")).toBe("open")
    })
  })

  describe("Disconnect", () => {
    test("clears timeouts on disconnect", async () => {
      container.innerHTML = createHoverCard({ openDelay: 500 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")

      controller.show()
      controller.disconnect()

      // Should not throw or cause issues after disconnect
      await new Promise(resolve => setTimeout(resolve, 600))
    })
  })

  describe("Alignment", () => {
    test("respects align=start value", async () => {
      container.innerHTML = createHoverCard({ align: "start" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")

      expect(controller.alignValue).toBe("start")
    })

    test("respects align=end value", async () => {
      container.innerHTML = createHoverCard({ align: "end" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")

      expect(controller.alignValue).toBe("end")
    })
  })

  describe("Targets", () => {
    test("has trigger target", async () => {
      container.innerHTML = createHoverCard()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")

      expect(controller.hasTriggerTarget).toBe(true)
    })

    test("has content target", async () => {
      container.innerHTML = createHoverCard()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--hover-card"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--hover-card")

      expect(controller.hasContentTarget).toBe(true)
    })
  })
})
