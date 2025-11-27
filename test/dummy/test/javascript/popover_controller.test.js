import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import PopoverController from "../../../../app/javascript/ui/controllers/popover_controller.js"

describe("PopoverController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--popover", PopoverController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  // Helper to create popover HTML
  function createPopover(options = {}) {
    const {
      open = false,
      placement = "bottom",
      offset = 4,
      trigger = "click",
      hoverDelay = 200
    } = options

    return `
      <div data-controller="ui--popover"
           data-ui--popover-open-value="${open}"
           data-ui--popover-placement-value="${placement}"
           data-ui--popover-offset-value="${offset}"
           data-ui--popover-trigger-value="${trigger}"
           data-ui--popover-hover-delay-value="${hoverDelay}">
        <button data-ui--popover-target="trigger" data-testid="trigger">
          Open Popover
        </button>
        <div data-ui--popover-target="content"
             data-state="closed"
             data-testid="content"
             style="position: absolute;">
          <p>Popover Content</p>
          <button data-testid="inner-button">Inner Button</button>
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createPopover()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--popover"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")

      expect(controller).not.toBeNull()
      expect(controller.openValue).toBe(false)
      expect(controller.placementValue).toBe("bottom")
      expect(controller.offsetValue).toBe(4)
      expect(controller.triggerValue).toBe("click")
    })

    test("sets initial data-state attribute", async () => {
      container.innerHTML = createPopover()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("closed")
    })
  })

  describe("Click trigger", () => {
    test("opens popover when trigger clicked", async () => {
      container.innerHTML = createPopover({ trigger: "click" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("open")
    })

    test("closes popover when trigger clicked again", async () => {
      container.innerHTML = createPopover({ trigger: "click" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')

      // Open
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("open")

      // Close
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(content.getAttribute("data-state")).toBe("closed")
    })

    test("closes popover when clicking outside", async () => {
      container.innerHTML = createPopover({ trigger: "click" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("open")

      // Click outside
      document.body.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.getAttribute("data-state")).toBe("closed")
    })

    test("does not close when clicking inside popover", async () => {
      container.innerHTML = createPopover({ trigger: "click" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("open")

      // Click inside popover
      const innerButton = container.querySelector('[data-testid="inner-button"]')
      innerButton.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.getAttribute("data-state")).toBe("open")
    })
  })

  describe("Hover trigger", () => {
    test("opens popover on mouse enter with delay", async () => {
      container.innerHTML = createPopover({ trigger: "hover", hoverDelay: 50 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      const mouseEnterEvent = new MouseEvent("mouseenter", { bubbles: true })
      trigger.dispatchEvent(mouseEnterEvent)

      // Should not be open immediately
      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("closed")

      // Wait for delay
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(content.getAttribute("data-state")).toBe("open")
    })

    test("closes popover on mouse leave", async () => {
      container.innerHTML = createPopover({ trigger: "hover", hoverDelay: 0 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      const element = container.querySelector('[data-controller="ui--popover"]')

      // Mouse enter
      const mouseEnterEvent = new MouseEvent("mouseenter", { bubbles: true })
      trigger.dispatchEvent(mouseEnterEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("open")

      // Mouse leave from the whole popover element
      const mouseLeaveEvent = new MouseEvent("mouseleave", { bubbles: true })
      element.dispatchEvent(mouseLeaveEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.getAttribute("data-state")).toBe("closed")
    })

    test("cancels show if mouse leaves before delay", async () => {
      container.innerHTML = createPopover({ trigger: "hover", hoverDelay: 200 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      const element = container.querySelector('[data-controller="ui--popover"]')

      // Mouse enter
      const mouseEnterEvent = new MouseEvent("mouseenter", { bubbles: true })
      trigger.dispatchEvent(mouseEnterEvent)

      // Mouse leave before delay completes
      await new Promise(resolve => setTimeout(resolve, 50))
      const mouseLeaveEvent = new MouseEvent("mouseleave", { bubbles: true })
      element.dispatchEvent(mouseLeaveEvent)

      // Wait past original delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("closed")
    })
  })

  describe("Keyboard interactions", () => {
    test("closes on Escape key", async () => {
      container.innerHTML = createPopover({ trigger: "click" })
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open popover
      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("open")

      // Press Escape
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(escapeEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.getAttribute("data-state")).toBe("closed")
    })
  })

  describe("Programmatic control", () => {
    test("show() opens popover", async () => {
      container.innerHTML = createPopover()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--popover"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")

      controller.show()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("open")
      expect(controller.openValue).toBe(true)
    })

    test("hide() closes popover", async () => {
      container.innerHTML = createPopover()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--popover"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")

      controller.show()
      await new Promise(resolve => setTimeout(resolve, 10))

      controller.hide()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.getAttribute("data-state")).toBe("closed")
      expect(controller.openValue).toBe(false)
    })
  })

  describe("Events", () => {
    test("dispatches popover:show event when opened", async () => {
      container.innerHTML = createPopover()
      await new Promise(resolve => setTimeout(resolve, 10))

      let eventFired = false
      const element = container.querySelector('[data-controller="ui--popover"]')
      element.addEventListener("popover:show", () => {
        eventFired = true
      })

      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")
      controller.show()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
    })

    test("dispatches popover:hide event when closed", async () => {
      container.innerHTML = createPopover()
      await new Promise(resolve => setTimeout(resolve, 10))

      let eventFired = false
      const element = container.querySelector('[data-controller="ui--popover"]')
      element.addEventListener("popover:hide", () => {
        eventFired = true
      })

      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")
      controller.show()
      await new Promise(resolve => setTimeout(resolve, 10))

      controller.hide()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
    })
  })

  describe("Placement", () => {
    test("accepts bottom placement", async () => {
      container.innerHTML = createPopover({ placement: "bottom" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--popover"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")

      expect(controller.placementValue).toBe("bottom")
    })

    test("accepts top placement", async () => {
      container.innerHTML = createPopover({ placement: "top" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--popover"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")

      expect(controller.placementValue).toBe("top")
    })

    test("accepts left placement", async () => {
      container.innerHTML = createPopover({ placement: "left" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--popover"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")

      expect(controller.placementValue).toBe("left")
    })

    test("accepts right placement", async () => {
      container.innerHTML = createPopover({ placement: "right" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--popover"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")

      expect(controller.placementValue).toBe("right")
    })
  })

  describe("Disconnect", () => {
    test("cleans up event listeners on disconnect", async () => {
      container.innerHTML = createPopover()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--popover"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")

      // Open popover
      controller.show()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Disconnect
      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Escape should not throw
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(escapeEvent)
    })

    test("clears hover timeout on disconnect", async () => {
      container.innerHTML = createPopover({ trigger: "hover", hoverDelay: 500 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      const element = container.querySelector('[data-controller="ui--popover"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--popover")

      // Start hover
      const mouseEnterEvent = new MouseEvent("mouseenter", { bubbles: true })
      trigger.dispatchEvent(mouseEnterEvent)

      // Disconnect before delay completes
      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Should not throw after delay
      await new Promise(resolve => setTimeout(resolve, 600))
    })
  })
})
