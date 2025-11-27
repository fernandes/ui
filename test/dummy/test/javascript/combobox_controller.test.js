import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import ComboboxController from "../../../../app/javascript/ui/controllers/combobox_controller.js"

describe("ComboboxController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--combobox", ComboboxController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createCombobox(options = {}) {
    const { value = "", items = ["apple", "banana", "cherry"] } = options

    const itemsHtml = items.map(item => `
      <div data-ui--combobox-target="item"
           data-value="${item}"
           data-testid="item-${item}">
        <span>${item.charAt(0).toUpperCase() + item.slice(1)}</span>
        <svg class="ml-auto opacity-0" data-testid="check-${item}"></svg>
      </div>
    `).join("")

    return `
      <div data-controller="ui--combobox"
           data-ui--combobox-value-value="${value}">
        <button data-testid="trigger">
          <span data-ui--combobox-target="text" data-testid="text">Select item...</span>
        </button>
        <div data-testid="content">
          ${itemsHtml}
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects successfully", async () => {
      container.innerHTML = createCombobox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--combobox")

      expect(controller).not.toBeNull()
    })

    test("starts with empty value by default", async () => {
      container.innerHTML = createCombobox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--combobox")

      expect(controller.valueValue).toBe("")
    })

    test("respects initial value", async () => {
      container.innerHTML = createCombobox({ value: "apple" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--combobox")

      expect(controller.valueValue).toBe("apple")
    })

    test("applies initial check icon visibility", async () => {
      container.innerHTML = createCombobox({ value: "banana" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const appleCheck = container.querySelector('[data-testid="check-apple"]')
      const bananaCheck = container.querySelector('[data-testid="check-banana"]')

      expect(bananaCheck.classList.contains("opacity-100")).toBe(true)
      expect(appleCheck.classList.contains("opacity-0")).toBe(true)
    })
  })

  describe("Selection", () => {
    test("handleSelect updates value", async () => {
      container.innerHTML = createCombobox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--combobox")
      const item = container.querySelector('[data-testid="item-apple"]')

      const event = new CustomEvent("command:select", {
        detail: { value: "apple", item },
        bubbles: true
      })
      element.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.valueValue).toBe("apple")
    })

    test("handleSelect updates text target", async () => {
      container.innerHTML = createCombobox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const item = container.querySelector('[data-testid="item-banana"]')
      const textTarget = container.querySelector('[data-testid="text"]')

      const event = new CustomEvent("command:select", {
        detail: { value: "banana", item },
        bubbles: true
      })
      element.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(textTarget.textContent).toBe("Banana")
    })
  })

  describe("Check Icons", () => {
    test("updateCheckIcons shows check for selected item", async () => {
      container.innerHTML = createCombobox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--combobox")
      const item = container.querySelector('[data-testid="item-cherry"]')

      const event = new CustomEvent("command:select", {
        detail: { value: "cherry", item },
        bubbles: true
      })
      element.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      const cherryCheck = container.querySelector('[data-testid="check-cherry"]')
      expect(cherryCheck.classList.contains("opacity-100")).toBe(true)
      expect(cherryCheck.classList.contains("opacity-0")).toBe(false)
    })

    test("updateCheckIcons hides check for unselected items", async () => {
      container.innerHTML = createCombobox({ value: "apple" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const item = container.querySelector('[data-testid="item-banana"]')

      const event = new CustomEvent("command:select", {
        detail: { value: "banana", item },
        bubbles: true
      })
      element.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      const appleCheck = container.querySelector('[data-testid="check-apple"]')
      const bananaCheck = container.querySelector('[data-testid="check-banana"]')

      expect(appleCheck.classList.contains("opacity-0")).toBe(true)
      expect(bananaCheck.classList.contains("opacity-100")).toBe(true)
    })
  })

  describe("Event Handling", () => {
    test("event listener is attached on connect", async () => {
      container.innerHTML = createCombobox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--combobox")

      // Verify the boundHandleSelect is set (listener attached in connect)
      expect(controller.boundHandleSelect).toBeDefined()
    })

    test("value changes on command:select event", async () => {
      container.innerHTML = createCombobox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--combobox")

      expect(controller.valueValue).toBe("")

      const item = container.querySelector('[data-testid="item-cherry"]')
      const event = new CustomEvent("command:select", {
        detail: { value: "cherry", item },
        bubbles: true
      })
      element.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.valueValue).toBe("cherry")
    })
  })

  describe("Disconnect", () => {
    test("removes event listener on disconnect", async () => {
      container.innerHTML = createCombobox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--combobox")

      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Should not throw when dispatching event after disconnect
      const item = container.querySelector('[data-testid="item-apple"]')
      const event = new CustomEvent("command:select", {
        detail: { value: "apple", item },
        bubbles: true
      })
      element.dispatchEvent(event)
    })
  })

  describe("Targets", () => {
    test("has text target", async () => {
      container.innerHTML = createCombobox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--combobox")

      expect(controller.hasTextTarget).toBe(true)
    })

    test("has item targets", async () => {
      container.innerHTML = createCombobox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--combobox"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--combobox")

      expect(controller.itemTargets.length).toBe(3)
    })
  })
})
