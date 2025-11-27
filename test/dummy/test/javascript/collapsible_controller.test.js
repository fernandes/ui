import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import CollapsibleController from "../../../../app/javascript/ui/controllers/collapsible_controller.js"

describe("CollapsibleController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--collapsible", CollapsibleController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createCollapsible(options = {}) {
    const { open = false, disabled = false } = options

    return `
      <div data-controller="ui--collapsible"
           data-ui--collapsible-open-value="${open}"
           data-ui--collapsible-disabled-value="${disabled}">
        <button type="button"
                data-ui--collapsible-target="trigger"
                data-action="click->ui--collapsible#toggle"
                aria-expanded="${open}"
                data-testid="trigger">
          Toggle
        </button>
        <div data-ui--collapsible-target="content"
             ${open ? '' : 'hidden'}
             data-testid="content"
             style="overflow: hidden; transition: height 0.2s;">
          <p>Collapsible content here</p>
        </div>
      </div>
    `
  }

  // Helper to dispatch click with event object
  function clickWithEvent(element) {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    element.dispatchEvent(event)
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createCollapsible()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--collapsible"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--collapsible")

      expect(controller).not.toBeNull()
      expect(controller.openValue).toBe(false)
      expect(controller.disabledValue).toBe(false)
    })

    test("starts closed by default", async () => {
      container.innerHTML = createCollapsible()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--collapsible"]')
      expect(element.dataset.state).toBe("closed")
    })

    test("starts open when open value is true", async () => {
      container.innerHTML = createCollapsible({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--collapsible"]')
      expect(element.dataset.state).toBe("open")
    })
  })

  describe("Toggle", () => {
    test("opens when toggling", async () => {
      container.innerHTML = createCollapsible()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--collapsible"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--collapsible")

      controller.openValue = true
      controller.updateState(true, false)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.dataset.state).toBe("open")
    })

    test("closes when toggling again", async () => {
      container.innerHTML = createCollapsible({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--collapsible"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--collapsible")

      controller.openValue = false
      controller.updateState(false, false)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.dataset.state).toBe("closed")
    })

    test("does not toggle when disabled", async () => {
      container.innerHTML = createCollapsible({ disabled: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--collapsible"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--collapsible")

      // Try to toggle (should be blocked by disabledValue check)
      const initialOpenValue = controller.openValue
      const mockEvent = { preventDefault: () => {} }
      controller.toggle(mockEvent)

      // Should remain unchanged
      expect(controller.openValue).toBe(initialOpenValue)
      expect(element.dataset.state).toBe("closed")
    })
  })

  describe("ARIA attributes", () => {
    test("updates aria-expanded on trigger", async () => {
      container.innerHTML = createCollapsible()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--collapsible"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--collapsible")
      const trigger = container.querySelector('[data-testid="trigger"]')
      expect(trigger.getAttribute("aria-expanded")).toBe("false")

      controller.openValue = true
      controller.updateState(true, false)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(trigger.getAttribute("aria-expanded")).toBe("true")
    })
  })

  describe("Content visibility", () => {
    test("removes hidden attribute when opening", async () => {
      container.innerHTML = createCollapsible()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--collapsible"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--collapsible")
      const content = container.querySelector('[data-testid="content"]')
      expect(content.hasAttribute("hidden")).toBe(true)

      controller.openValue = true
      controller.updateState(true, false)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.hasAttribute("hidden")).toBe(false)
    })

    test("sets height to 0 when closing", async () => {
      container.innerHTML = createCollapsible({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--collapsible"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--collapsible")

      controller.openValue = false
      controller.updateState(false, false)
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.style.height).toBe("0px")
    })
  })
})
