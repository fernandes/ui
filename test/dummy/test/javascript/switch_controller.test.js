import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import SwitchController from "../../../../app/javascript/ui/controllers/switch_controller.js"

describe("SwitchController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--switch", SwitchController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createSwitch(options = {}) {
    const { checked = false, disabled = false } = options

    return `
      <button data-controller="ui--switch"
              data-ui--switch-checked-value="${checked}"
              ${disabled ? 'disabled' : ''}
              data-action="click->ui--switch#toggle keydown->ui--switch#handleKeydown"
              role="switch"
              data-testid="switch">
        <span data-ui--switch-target="thumb" data-testid="thumb"></span>
        <input type="hidden" name="switch" value="${checked ? '1' : '0'}" />
      </button>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createSwitch()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="switch"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--switch")

      expect(controller).not.toBeNull()
      expect(controller.checkedValue).toBe(false)
    })

    test("starts unchecked by default", async () => {
      container.innerHTML = createSwitch()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="switch"]')
      expect(element.dataset.state).toBe("unchecked")
      expect(element.getAttribute("aria-checked")).toBe("false")
    })

    test("starts checked when checked value is true", async () => {
      container.innerHTML = createSwitch({ checked: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="switch"]')
      expect(element.dataset.state).toBe("checked")
      expect(element.getAttribute("aria-checked")).toBe("true")
    })
  })

  describe("Toggle", () => {
    test("toggles state on click", async () => {
      container.innerHTML = createSwitch()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="switch"]')
      element.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.dataset.state).toBe("checked")
      expect(element.getAttribute("aria-checked")).toBe("true")
    })

    test("toggles back on second click", async () => {
      container.innerHTML = createSwitch({ checked: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="switch"]')
      element.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.dataset.state).toBe("unchecked")
      expect(element.getAttribute("aria-checked")).toBe("false")
    })

    test("does not toggle when disabled", async () => {
      container.innerHTML = createSwitch({ disabled: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="switch"]')
      element.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.dataset.state).toBe("unchecked")
    })
  })

  describe("Keyboard support", () => {
    test("toggles on Space key", async () => {
      container.innerHTML = createSwitch()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="switch"]')
      const spaceEvent = new KeyboardEvent("keydown", { key: " ", bubbles: true })
      element.dispatchEvent(spaceEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.dataset.state).toBe("checked")
    })

    test("toggles on Enter key", async () => {
      container.innerHTML = createSwitch()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="switch"]')
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      element.dispatchEvent(enterEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(element.dataset.state).toBe("checked")
    })
  })

  describe("Thumb target", () => {
    test("updates thumb data-state", async () => {
      container.innerHTML = createSwitch()
      await new Promise(resolve => setTimeout(resolve, 10))

      const thumb = container.querySelector('[data-testid="thumb"]')
      expect(thumb.dataset.state).toBe("unchecked")

      const element = container.querySelector('[data-testid="switch"]')
      element.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(thumb.dataset.state).toBe("checked")
    })
  })

  describe("Hidden input", () => {
    test("updates hidden input value", async () => {
      container.innerHTML = createSwitch()
      await new Promise(resolve => setTimeout(resolve, 10))

      const hiddenInput = container.querySelector('input[type="hidden"]')
      expect(hiddenInput.value).toBe("0")

      const element = container.querySelector('[data-testid="switch"]')
      element.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(hiddenInput.value).toBe("1")
    })
  })

  describe("Events", () => {
    test("dispatches change event on toggle", async () => {
      container.innerHTML = createSwitch()
      await new Promise(resolve => setTimeout(resolve, 10))

      let changeEventFired = false
      const element = container.querySelector('[data-testid="switch"]')
      element.addEventListener("change", () => {
        changeEventFired = true
      })

      element.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(changeEventFired).toBe(true)
    })
  })
})
