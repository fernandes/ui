import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import AccordionController from "../../../../app/javascript/ui/controllers/accordion_controller.js"

describe("AccordionController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--accordion", AccordionController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  // Helper to create accordion HTML
  function createAccordion(options = {}) {
    const {
      type = "single",
      collapsible = false,
      items = [
        { value: "item-1", title: "Item 1", content: "Content 1", open: false },
        { value: "item-2", title: "Item 2", content: "Content 2", open: false },
        { value: "item-3", title: "Item 3", content: "Content 3", open: false }
      ]
    } = options

    const itemsHtml = items.map(item => `
      <div data-ui--accordion-target="item"
           data-value="${item.value}"
           data-state="${item.open ? 'open' : 'closed'}"
           data-testid="item-${item.value}">
        <h3 data-state="${item.open ? 'open' : 'closed'}">
          <button type="button"
                  data-ui--accordion-target="trigger"
                  data-action="click->ui--accordion#toggle"
                  aria-expanded="${item.open}"
                  data-state="${item.open ? 'open' : 'closed'}"
                  data-testid="trigger-${item.value}">
            ${item.title}
          </button>
        </h3>
        <div data-ui--accordion-target="content"
             data-state="${item.open ? 'open' : 'closed'}"
             role="region"
             ${item.open ? '' : 'hidden'}
             data-testid="content-${item.value}"
             style="height: ${item.open ? 'auto' : '0px'}; overflow: hidden; transition: height 0.2s ease-out;">
          <p>${item.content}</p>
        </div>
      </div>
    `).join("")

    return `
      <div data-controller="ui--accordion"
           data-ui--accordion-type-value="${type}"
           data-ui--accordion-collapsible-value="${collapsible}">
        ${itemsHtml}
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--accordion"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--accordion")

      expect(controller).not.toBeNull()
      expect(controller.typeValue).toBe("single")
      expect(controller.collapsibleValue).toBe(false)
    })

    test("starts with all items closed by default", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const items = container.querySelectorAll('[data-ui--accordion-target="item"]')
      items.forEach(item => {
        expect(item.dataset.state).toBe("closed")
      })
    })

    test("respects initially open item", async () => {
      container.innerHTML = createAccordion({
        items: [
          { value: "item-1", title: "Item 1", content: "Content 1", open: true },
          { value: "item-2", title: "Item 2", content: "Content 2", open: false },
          { value: "item-3", title: "Item 3", content: "Content 3", open: false }
        ]
      })
      await new Promise(resolve => setTimeout(resolve, 10))

      const item1 = container.querySelector('[data-testid="item-item-1"]')
      expect(item1.dataset.state).toBe("open")
    })
  })

  describe("Single type", () => {
    test("opens item on click", async () => {
      container.innerHTML = createAccordion({ type: "single" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const item1 = container.querySelector('[data-testid="item-item-1"]')
      expect(item1.dataset.state).toBe("open")

      const trigger = container.querySelector('[data-testid="trigger-item-1"]')
      expect(trigger.getAttribute("aria-expanded")).toBe("true")
    })

    test("closes other items when opening new one", async () => {
      container.innerHTML = createAccordion({
        type: "single",
        items: [
          { value: "item-1", title: "Item 1", content: "Content 1", open: true },
          { value: "item-2", title: "Item 2", content: "Content 2", open: false },
          { value: "item-3", title: "Item 3", content: "Content 3", open: false }
        ]
      })
      await new Promise(resolve => setTimeout(resolve, 10))

      // Click item 2
      const trigger2 = container.querySelector('[data-testid="trigger-item-2"]')
      trigger2.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const item1 = container.querySelector('[data-testid="item-item-1"]')
      const item2 = container.querySelector('[data-testid="item-item-2"]')

      expect(item1.dataset.state).toBe("closed")
      expect(item2.dataset.state).toBe("open")
    })

    test("toggles item closed when clicking again", async () => {
      container.innerHTML = createAccordion({ type: "single" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')

      // Open
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const item1 = container.querySelector('[data-testid="item-item-1"]')
      expect(item1.dataset.state).toBe("open")

      // Close
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(item1.dataset.state).toBe("closed")
    })
  })

  describe("Multiple type", () => {
    test("allows multiple items open simultaneously", async () => {
      container.innerHTML = createAccordion({ type: "multiple" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      const trigger2 = container.querySelector('[data-testid="trigger-item-2"]')

      // Open item 1
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Open item 2
      trigger2.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const item1 = container.querySelector('[data-testid="item-item-1"]')
      const item2 = container.querySelector('[data-testid="item-item-2"]')

      // Both should be open
      expect(item1.dataset.state).toBe("open")
      expect(item2.dataset.state).toBe("open")
    })

    test("toggles individual items independently", async () => {
      container.innerHTML = createAccordion({ type: "multiple" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      const trigger2 = container.querySelector('[data-testid="trigger-item-2"]')

      // Open both
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))
      trigger2.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Close item 1
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const item1 = container.querySelector('[data-testid="item-item-1"]')
      const item2 = container.querySelector('[data-testid="item-item-2"]')

      expect(item1.dataset.state).toBe("closed")
      expect(item2.dataset.state).toBe("open")
    })
  })

  describe("Content visibility", () => {
    test("shows content when item opens", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content1 = container.querySelector('[data-testid="content-item-1"]')
      expect(content1.hasAttribute("hidden")).toBe(false)
      expect(content1.dataset.state).toBe("open")
    })

    test("hides content when item closes", async () => {
      container.innerHTML = createAccordion({
        items: [
          { value: "item-1", title: "Item 1", content: "Content 1", open: true },
          { value: "item-2", title: "Item 2", content: "Content 2", open: false },
          { value: "item-3", title: "Item 3", content: "Content 3", open: false }
        ]
      })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for transition

      const content1 = container.querySelector('[data-testid="content-item-1"]')
      expect(content1.dataset.state).toBe("closed")
    })
  })

  describe("ARIA attributes", () => {
    test("trigger has correct ARIA attributes when closed", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      expect(trigger1.getAttribute("aria-expanded")).toBe("false")
    })

    test("trigger has correct ARIA attributes when open", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(trigger1.getAttribute("aria-expanded")).toBe("true")
    })

    test("content has region role", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content1 = container.querySelector('[data-testid="content-item-1"]')
      expect(content1.getAttribute("role")).toBe("region")
    })
  })

  describe("Data state attributes", () => {
    test("updates item data-state", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      const item1 = container.querySelector('[data-testid="item-item-1"]')

      expect(item1.dataset.state).toBe("closed")

      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(item1.dataset.state).toBe("open")
    })

    test("updates trigger data-state", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')

      expect(trigger1.dataset.state).toBe("closed")

      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(trigger1.dataset.state).toBe("open")
    })

    test("updates content data-state", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      const content1 = container.querySelector('[data-testid="content-item-1"]')

      expect(content1.dataset.state).toBe("closed")

      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content1.dataset.state).toBe("open")
    })
  })

  describe("Animation support", () => {
    test("sets height style for animation", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      const content1 = container.querySelector('[data-testid="content-item-1"]')

      // Before opening, height is 0
      expect(content1.style.height).toBe("0px")

      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // After opening, data-state should be open (height may still be 0 if scrollHeight is 0 in happy-dom)
      expect(content1.dataset.state).toBe("open")
    })

    test("sets height to 0 when closing", async () => {
      container.innerHTML = createAccordion()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-item-1"]')
      const content1 = container.querySelector('[data-testid="content-item-1"]')

      // Open
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Close
      trigger1.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content1.style.height).toBe("0px")
    })
  })
})
