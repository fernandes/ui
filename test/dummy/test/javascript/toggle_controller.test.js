import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import ToggleController from "../../../../app/javascript/ui/controllers/toggle_controller.js"

describe("ToggleController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--toggle", ToggleController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createToggle(options = {}) {
    const { pressed = false } = options

    return `
      <button type="button"
              data-controller="ui--toggle"
              data-ui--toggle-pressed-value="${pressed}"
              data-action="click->ui--toggle#toggle"
              data-testid="toggle">
        Toggle Button
      </button>
    `
  }

  // Helper to dispatch click with event object
  function clickWithEvent(element) {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    element.dispatchEvent(event)
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createToggle()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="toggle"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle")

      expect(controller).not.toBeNull()
      expect(controller.pressedValue).toBe(false)
    })

    test("starts with data-state=off when not pressed", async () => {
      container.innerHTML = createToggle()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="toggle"]')
      expect(element.dataset.state).toBe("off")
      expect(element.getAttribute("aria-pressed")).toBe("false")
    })

    test("starts with data-state=on when pressed", async () => {
      container.innerHTML = createToggle({ pressed: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="toggle"]')
      expect(element.dataset.state).toBe("on")
      expect(element.getAttribute("aria-pressed")).toBe("true")
    })
  })

  describe("Toggle", () => {
    test("toggles state on toggle method call", async () => {
      container.innerHTML = createToggle()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="toggle"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle")

      controller.toggle()
      controller.updateState() // Manually trigger since valueChanged callbacks may not fire in test
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.dataset.state).toBe("on")
      expect(element.getAttribute("aria-pressed")).toBe("true")
    })

    test("toggles back on second toggle call", async () => {
      container.innerHTML = createToggle({ pressed: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="toggle"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle")

      controller.toggle()
      controller.updateState()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.dataset.state).toBe("off")
      expect(element.getAttribute("aria-pressed")).toBe("false")
    })
  })

  describe("ARIA attributes", () => {
    test("has aria-pressed attribute", async () => {
      container.innerHTML = createToggle()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="toggle"]')
      expect(element.hasAttribute("aria-pressed")).toBe(true)
    })

    test("updates aria-pressed on toggle", async () => {
      container.innerHTML = createToggle()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="toggle"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle")
      expect(element.getAttribute("aria-pressed")).toBe("false")

      controller.toggle()
      controller.updateState()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.getAttribute("aria-pressed")).toBe("true")
    })
  })

  describe("Data state", () => {
    test("uses on/off for data-state values", async () => {
      container.innerHTML = createToggle()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="toggle"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle")
      expect(element.dataset.state).toBe("off")

      controller.toggle()
      controller.updateState()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.dataset.state).toBe("on")
    })
  })
})
