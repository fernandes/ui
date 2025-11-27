import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import TooltipController from "../../../../app/javascript/ui/controllers/tooltip_controller.js"

describe("TooltipController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--tooltip", TooltipController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    // Clean up any tooltips moved to body
    document.querySelectorAll('[data-testid="tooltip-content"]').forEach(el => el.remove())
    document.body.innerHTML = ""
  })

  // Helper to create tooltip HTML
  function createTooltip(options = {}) {
    const {
      sideOffset = 4,
      hoverDelay = 0,
      side = "top",
      align = "center"
    } = options

    return `
      <div data-controller="ui--tooltip"
           data-ui--tooltip-side-offset-value="${sideOffset}"
           data-ui--tooltip-hover-delay-value="${hoverDelay}">
        <button data-ui--tooltip-target="trigger"
                data-action="mouseenter->ui--tooltip#show mouseleave->ui--tooltip#hide"
                data-testid="trigger">
          Hover me
        </button>
        <div data-ui--tooltip-target="content"
             data-state="closed"
             data-side="${side}"
             data-align="${align}"
             role="tooltip"
             data-testid="tooltip-content">
          Tooltip text
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createTooltip()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--tooltip"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--tooltip")

      expect(controller).not.toBeNull()
      expect(controller.sideOffsetValue).toBe(4)
      expect(controller.hoverDelayValue).toBe(0)
    })

    test("moves content to document.body", async () => {
      container.innerHTML = createTooltip()
      await new Promise(resolve => setTimeout(resolve, 50)) // Wait for requestAnimationFrame

      // Content should be moved to body
      const contentInBody = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(contentInBody).not.toBeNull()

      // Content should no longer be in original container (as direct child)
      const contentInContainer = container.querySelector('[data-testid="tooltip-content"]')
      expect(contentInContainer).toBeNull()
    })
  })

  describe("Show/Hide", () => {
    test("shows tooltip on mouse enter", async () => {
      container.innerHTML = createTooltip({ hoverDelay: 0 })
      await new Promise(resolve => setTimeout(resolve, 50))

      const trigger = container.querySelector('[data-testid="trigger"]')
      const mouseEnterEvent = new MouseEvent("mouseenter", { bubbles: true })
      trigger.dispatchEvent(mouseEnterEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(content.getAttribute("data-state")).toBe("open")
    })

    test("hides tooltip on mouse leave", async () => {
      container.innerHTML = createTooltip({ hoverDelay: 0 })
      await new Promise(resolve => setTimeout(resolve, 50))

      const trigger = container.querySelector('[data-testid="trigger"]')

      // Show
      const mouseEnterEvent = new MouseEvent("mouseenter", { bubbles: true })
      trigger.dispatchEvent(mouseEnterEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(content.getAttribute("data-state")).toBe("open")

      // Hide
      const mouseLeaveEvent = new MouseEvent("mouseleave", { bubbles: true })
      trigger.dispatchEvent(mouseLeaveEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.getAttribute("data-state")).toBe("closed")
    })

    test("respects hover delay", async () => {
      container.innerHTML = createTooltip({ hoverDelay: 100 })
      await new Promise(resolve => setTimeout(resolve, 50))

      const trigger = container.querySelector('[data-testid="trigger"]')
      const mouseEnterEvent = new MouseEvent("mouseenter", { bubbles: true })
      trigger.dispatchEvent(mouseEnterEvent)

      // Should not be open immediately
      const content = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(content.getAttribute("data-state")).toBe("closed")

      // Wait for delay
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(content.getAttribute("data-state")).toBe("open")
    })

    test("cancels show if mouse leaves before delay", async () => {
      container.innerHTML = createTooltip({ hoverDelay: 200 })
      await new Promise(resolve => setTimeout(resolve, 50))

      const trigger = container.querySelector('[data-testid="trigger"]')

      // Mouse enter
      const mouseEnterEvent = new MouseEvent("mouseenter", { bubbles: true })
      trigger.dispatchEvent(mouseEnterEvent)

      // Mouse leave before delay completes
      await new Promise(resolve => setTimeout(resolve, 50))
      const mouseLeaveEvent = new MouseEvent("mouseleave", { bubbles: true })
      trigger.dispatchEvent(mouseLeaveEvent)

      // Wait past original delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const content = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(content.getAttribute("data-state")).toBe("closed")
    })
  })

  describe("Keyboard interactions", () => {
    test("hides on Escape key", async () => {
      container.innerHTML = createTooltip({ hoverDelay: 0 })
      await new Promise(resolve => setTimeout(resolve, 50))

      const trigger = container.querySelector('[data-testid="trigger"]')

      // Show tooltip
      const mouseEnterEvent = new MouseEvent("mouseenter", { bubbles: true })
      trigger.dispatchEvent(mouseEnterEvent)
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(content.getAttribute("data-state")).toBe("open")

      // Press Escape
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(escapeEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.getAttribute("data-state")).toBe("closed")
    })
  })

  describe("Programmatic control", () => {
    test("show() opens tooltip", async () => {
      container.innerHTML = createTooltip()
      await new Promise(resolve => setTimeout(resolve, 50))

      const element = container.querySelector('[data-controller="ui--tooltip"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--tooltip")

      controller.show()
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(content.getAttribute("data-state")).toBe("open")
      expect(controller.isOpen).toBe(true)
    })

    test("hide() closes tooltip", async () => {
      container.innerHTML = createTooltip()
      await new Promise(resolve => setTimeout(resolve, 50))

      const element = container.querySelector('[data-controller="ui--tooltip"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--tooltip")

      controller.show()
      await new Promise(resolve => setTimeout(resolve, 50))

      controller.hide()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(content.getAttribute("data-state")).toBe("closed")
      expect(controller.isOpen).toBe(false)
    })
  })

  describe("Side and alignment", () => {
    test("respects data-side attribute", async () => {
      container.innerHTML = createTooltip({ side: "bottom" })
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(content.getAttribute("data-side")).toBe("bottom")
    })

    test("respects data-align attribute", async () => {
      container.innerHTML = createTooltip({ align: "start" })
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(content.getAttribute("data-align")).toBe("start")
    })
  })

  describe("ARIA attributes", () => {
    test("has role tooltip", async () => {
      container.innerHTML = createTooltip()
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(content.getAttribute("role")).toBe("tooltip")
    })
  })

  describe("Disconnect", () => {
    test("returns content to original parent on disconnect", async () => {
      container.innerHTML = createTooltip()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Content should be in body
      let contentInBody = document.body.querySelector('[data-testid="tooltip-content"]')
      expect(contentInBody).not.toBeNull()

      // Disconnect
      const element = container.querySelector('[data-controller="ui--tooltip"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--tooltip")
      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Content should be returned to original parent
      const contentInContainer = container.querySelector('[data-testid="tooltip-content"]')
      expect(contentInContainer).not.toBeNull()
    })

    test("removes escape handler on disconnect", async () => {
      container.innerHTML = createTooltip()
      await new Promise(resolve => setTimeout(resolve, 50))

      const element = container.querySelector('[data-controller="ui--tooltip"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--tooltip")

      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Escape should not throw
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(escapeEvent)
    })

    test("clears hover timeout on disconnect", async () => {
      container.innerHTML = createTooltip({ hoverDelay: 500 })
      await new Promise(resolve => setTimeout(resolve, 50))

      const trigger = container.querySelector('[data-testid="trigger"]')
      const element = container.querySelector('[data-controller="ui--tooltip"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--tooltip")

      // Start show delay
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
