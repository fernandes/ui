import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import SelectController from "../../../../app/javascript/ui/controllers/select_controller.js"

describe("SelectController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--select", SelectController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  // Helper to create select HTML
  function createSelect(options = {}) {
    const {
      value = "",
      items = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "orange", label: "Orange" }
      ]
    } = options

    const itemsHtml = items.map(item => `
      <div role="option"
           data-ui--select-target="item"
           data-value="${item.value}"
           data-disabled="${item.disabled || false}"
           data-action="click->ui--select#selectItem mouseenter->ui--select#handleItemMouseEnter"
           aria-selected="false"
           data-state="unchecked"
           tabindex="-1"
           data-testid="item-${item.value}">
        <span>${item.label}</span>
        <span data-ui--select-target="itemCheck" class="opacity-0">✓</span>
      </div>
    `).join("")

    return `
      <div data-controller="ui--select"
           data-ui--select-value-value="${value}">
        <button data-ui--select-target="trigger"
                data-action="click->ui--select#toggle"
                aria-expanded="false"
                data-testid="trigger">
          <span data-ui--select-target="valueDisplay" data-testid="value-display">Select an option</span>
        </button>
        <input type="hidden" data-ui--select-target="hiddenInput" data-testid="hidden-input" />
        <div data-ui--select-target="content"
             data-state="closed"
             role="listbox"
             style="position: absolute;"
             data-testid="content">
          <div data-ui--select-target="viewport" data-testid="viewport" style="overflow: auto;">
            ${itemsHtml}
          </div>
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--select"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--select")

      expect(controller).not.toBeNull()
      expect(controller.openValue).toBe(false)
    })

    test("starts with closed state", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.dataset.state).toBe("closed")
    })

    test("initializes with pre-selected value", async () => {
      container.innerHTML = createSelect({ value: "banana" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const hiddenInput = container.querySelector('[data-testid="hidden-input"]')
      expect(hiddenInput.value).toBe("banana")
    })
  })

  describe("Open/Close", () => {
    test("opens dropdown when trigger clicked", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.dataset.state).toBe("open")
      expect(trigger.getAttribute("aria-expanded")).toBe("true")
    })

    test("closes dropdown when trigger clicked again", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')

      // Open
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Close
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.dataset.state).toBe("closed")
      expect(trigger.getAttribute("aria-expanded")).toBe("false")
    })

    test("closes dropdown when clicking outside", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.dataset.state).toBe("open")

      // Click outside
      document.body.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.dataset.state).toBe("closed")
    })
  })

  describe("Selection", () => {
    test("selects item on click", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const bananaItem = container.querySelector('[data-testid="item-banana"]')
      bananaItem.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--select"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--select")

      expect(controller.valueValue).toBe("banana")
    })

    test("updates hidden input on selection", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const orangeItem = container.querySelector('[data-testid="item-orange"]')
      orangeItem.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const hiddenInput = container.querySelector('[data-testid="hidden-input"]')
      expect(hiddenInput.value).toBe("orange")
    })

    test("updates value display on selection", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const appleItem = container.querySelector('[data-testid="item-apple"]')
      appleItem.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const valueDisplay = container.querySelector('[data-testid="value-display"]')
      expect(valueDisplay.textContent).toBe("Apple")
    })

    test("closes dropdown after selection", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const bananaItem = container.querySelector('[data-testid="item-banana"]')
      bananaItem.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.dataset.state).toBe("closed")
    })

    test("dispatches change event on hidden input", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      let changeEventFired = false
      const hiddenInput = container.querySelector('[data-testid="hidden-input"]')
      hiddenInput.addEventListener("change", () => {
        changeEventFired = true
      })

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const appleItem = container.querySelector('[data-testid="item-apple"]')
      appleItem.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(changeEventFired).toBe(true)
    })

    test("marks selected item with aria-selected and data-state", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const bananaItem = container.querySelector('[data-testid="item-banana"]')
      bananaItem.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Reopen to check state
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(bananaItem.getAttribute("aria-selected")).toBe("true")
      expect(bananaItem.dataset.state).toBe("checked")
    })

    test("does not select disabled items", async () => {
      container.innerHTML = createSelect({
        items: [
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana", disabled: true },
          { value: "orange", label: "Orange" }
        ]
      })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const bananaItem = container.querySelector('[data-testid="item-banana"]')
      bananaItem.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--select"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--select")

      expect(controller.valueValue).toBe("")
    })
  })

  describe("Keyboard navigation", () => {
    test("closes on Escape key", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.dataset.state).toBe("open")

      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(escapeEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.dataset.state).toBe("closed")
    })

    test("navigates with ArrowDown", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const arrowDownEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      document.dispatchEvent(arrowDownEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Check that some item is highlighted
      const highlightedItem = container.querySelector('[data-highlighted="true"]')
      expect(highlightedItem).not.toBeNull()
    })

    test("navigates with ArrowUp", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Go down first
      const arrowDownEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      document.dispatchEvent(arrowDownEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Go down again
      document.dispatchEvent(arrowDownEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Go up
      const arrowUpEvent = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
      document.dispatchEvent(arrowUpEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const highlightedItem = container.querySelector('[data-highlighted="true"]')
      expect(highlightedItem).not.toBeNull()
    })

    test("selects item with Enter key", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Navigate to an item
      const arrowDownEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      document.dispatchEvent(arrowDownEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Select with Enter
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      document.dispatchEvent(enterEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--select"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--select")

      expect(controller.valueValue).not.toBe("")
    })

    test("navigates to first item with Home key", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Navigate down a couple times
      const arrowDownEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      document.dispatchEvent(arrowDownEvent)
      document.dispatchEvent(arrowDownEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Press Home
      const homeEvent = new KeyboardEvent("keydown", { key: "Home", bubbles: true })
      document.dispatchEvent(homeEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const appleItem = container.querySelector('[data-testid="item-apple"]')
      expect(appleItem.dataset.highlighted).toBe("true")
    })

    test("navigates to last item with End key", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Press End
      const endEvent = new KeyboardEvent("keydown", { key: "End", bubbles: true })
      document.dispatchEvent(endEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const orangeItem = container.querySelector('[data-testid="item-orange"]')
      expect(orangeItem.dataset.highlighted).toBe("true")
    })
  })

  describe("Mouse hover", () => {
    test("highlights item on mouse enter", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const bananaItem = container.querySelector('[data-testid="item-banana"]')
      const mouseEnterEvent = new MouseEvent("mouseenter", { bubbles: true })
      bananaItem.dispatchEvent(mouseEnterEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(bananaItem.classList.contains("bg-accent")).toBe(true)
    })
  })

  describe("Disconnect", () => {
    test("cleans up event listeners on disconnect", async () => {
      container.innerHTML = createSelect()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 50))

      const element = container.querySelector('[data-controller="ui--select"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--select")

      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Should not throw
      document.body.click()
    })
  })
})
