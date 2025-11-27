import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import ToggleGroupController from "../../../../app/javascript/ui/controllers/toggle_group_controller.js"

describe("ToggleGroupController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--toggle-group", ToggleGroupController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createToggleGroup(options = {}) {
    const { type = "single", value = "[]", items = ["bold", "italic", "underline"] } = options

    const itemsHtml = items.map(item => `
      <button type="button"
              data-ui--toggle-group-target="item"
              data-value="${item}"
              data-state="off"
              aria-pressed="false"
              data-action="click->ui--toggle-group#toggle"
              data-testid="item-${item}">
        ${item.charAt(0).toUpperCase() + item.slice(1)}
      </button>
    `).join("")

    return `
      <div data-controller="ui--toggle-group"
           data-ui--toggle-group-type-value="${type}"
           data-ui--toggle-group-value-value='${value}'
           role="group"
           data-testid="group">
        ${itemsHtml}
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createToggleGroup()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")

      expect(controller).not.toBeNull()
      expect(controller.typeValue).toBe("single")
    })

    test("parses initial value", async () => {
      container.innerHTML = createToggleGroup({ value: '["bold"]' })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")

      expect(controller.selectedValues).toContain("bold")
    })

    test("updates items based on initial value", async () => {
      container.innerHTML = createToggleGroup({ value: '["italic"]' })
      await new Promise(resolve => setTimeout(resolve, 10))

      const italicItem = container.querySelector('[data-testid="item-italic"]')
      expect(italicItem.dataset.state).toBe("on")
    })

    test("has item targets", async () => {
      container.innerHTML = createToggleGroup()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")

      expect(controller.itemTargets.length).toBe(3)
    })
  })

  describe("Single Selection", () => {
    test("selects item on toggle", async () => {
      container.innerHTML = createToggleGroup({ type: "single" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const boldItem = container.querySelector('[data-testid="item-bold"]')

      const event = { currentTarget: boldItem }
      controller.toggle(event)

      expect(boldItem.dataset.state).toBe("on")
      expect(controller.selectedValues).toContain("bold")
    })

    test("deselects other items when selecting new one", async () => {
      container.innerHTML = createToggleGroup({ type: "single", value: '["bold"]' })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const boldItem = container.querySelector('[data-testid="item-bold"]')
      const italicItem = container.querySelector('[data-testid="item-italic"]')

      expect(boldItem.dataset.state).toBe("on")

      const event = { currentTarget: italicItem }
      controller.toggle(event)

      expect(boldItem.dataset.state).toBe("off")
      expect(italicItem.dataset.state).toBe("on")
    })

    test("allows deselecting current item", async () => {
      container.innerHTML = createToggleGroup({ type: "single", value: '["bold"]' })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const boldItem = container.querySelector('[data-testid="item-bold"]')

      const event = { currentTarget: boldItem }
      controller.toggle(event)

      expect(boldItem.dataset.state).toBe("off")
      expect(controller.selectedValues.length).toBe(0)
    })

    test("uses aria-checked for single mode", async () => {
      container.innerHTML = createToggleGroup({ type: "single" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const boldItem = container.querySelector('[data-testid="item-bold"]')

      const event = { currentTarget: boldItem }
      controller.toggle(event)

      expect(boldItem.getAttribute("aria-checked")).toBe("true")
    })
  })

  describe("Multiple Selection", () => {
    test("allows selecting multiple items", async () => {
      container.innerHTML = createToggleGroup({ type: "multiple" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const boldItem = container.querySelector('[data-testid="item-bold"]')
      const italicItem = container.querySelector('[data-testid="item-italic"]')

      controller.toggle({ currentTarget: boldItem })
      controller.toggle({ currentTarget: italicItem })

      expect(boldItem.dataset.state).toBe("on")
      expect(italicItem.dataset.state).toBe("on")
      expect(controller.selectedValues).toContain("bold")
      expect(controller.selectedValues).toContain("italic")
    })

    test("allows deselecting individual items", async () => {
      container.innerHTML = createToggleGroup({ type: "multiple", value: '["bold", "italic"]' })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const boldItem = container.querySelector('[data-testid="item-bold"]')
      const italicItem = container.querySelector('[data-testid="item-italic"]')

      controller.toggle({ currentTarget: boldItem })

      expect(boldItem.dataset.state).toBe("off")
      expect(italicItem.dataset.state).toBe("on")
    })

    test("uses aria-pressed for multiple mode", async () => {
      container.innerHTML = createToggleGroup({ type: "multiple" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const boldItem = container.querySelector('[data-testid="item-bold"]')

      controller.toggle({ currentTarget: boldItem })

      expect(boldItem.getAttribute("aria-pressed")).toBe("true")
    })
  })

  describe("Events", () => {
    test("dispatches change event on toggle", async () => {
      container.innerHTML = createToggleGroup()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const boldItem = container.querySelector('[data-testid="item-bold"]')

      let changeEventFired = false
      let eventDetail = null
      element.addEventListener("ui--toggle-group:change", (e) => {
        changeEventFired = true
        eventDetail = e.detail
      })

      controller.toggle({ currentTarget: boldItem })

      expect(changeEventFired).toBe(true)
      expect(eventDetail.value).toBe("bold")
      expect(eventDetail.type).toBe("single")
    })

    test("dispatches array value for multiple mode", async () => {
      container.innerHTML = createToggleGroup({ type: "multiple" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const boldItem = container.querySelector('[data-testid="item-bold"]')

      let eventDetail = null
      element.addEventListener("ui--toggle-group:change", (e) => {
        eventDetail = e.detail
      })

      controller.toggle({ currentTarget: boldItem })

      expect(Array.isArray(eventDetail.value)).toBe(true)
      expect(eventDetail.value).toContain("bold")
    })
  })

  describe("getValue / setValue", () => {
    test("getValue returns single value in single mode", async () => {
      container.innerHTML = createToggleGroup({ type: "single", value: '["bold"]' })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")

      expect(controller.getValue()).toBe("bold")
    })

    test("getValue returns null when nothing selected in single mode", async () => {
      container.innerHTML = createToggleGroup({ type: "single" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")

      expect(controller.getValue()).toBeNull()
    })

    test("getValue returns array in multiple mode", async () => {
      container.innerHTML = createToggleGroup({ type: "multiple", value: '["bold", "italic"]' })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")

      const value = controller.getValue()
      expect(Array.isArray(value)).toBe(true)
      expect(value).toContain("bold")
      expect(value).toContain("italic")
    })

    test("setValue updates selection in single mode", async () => {
      container.innerHTML = createToggleGroup({ type: "single" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const italicItem = container.querySelector('[data-testid="item-italic"]')

      controller.setValue("italic")

      expect(italicItem.dataset.state).toBe("on")
    })

    test("setValue updates selection in multiple mode", async () => {
      container.innerHTML = createToggleGroup({ type: "multiple" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")
      const boldItem = container.querySelector('[data-testid="item-bold"]')
      const underlineItem = container.querySelector('[data-testid="item-underline"]')

      controller.setValue(["bold", "underline"])

      expect(boldItem.dataset.state).toBe("on")
      expect(underlineItem.dataset.state).toBe("on")
    })
  })

  describe("Data State", () => {
    test("items without value are not toggled", async () => {
      container.innerHTML = createToggleGroup()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="group"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--toggle-group")

      const itemWithoutValue = document.createElement("button")
      itemWithoutValue.dataset.uiToggleGroupTarget = "item"
      // No data-value attribute

      const event = { currentTarget: itemWithoutValue }
      controller.toggle(event) // Should not throw

      // selectedValues should be unchanged
      expect(controller.selectedValues.length).toBe(0)
    })
  })
})
