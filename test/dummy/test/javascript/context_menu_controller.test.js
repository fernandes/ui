import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import ContextMenuController from "../../../../app/javascript/ui/controllers/context_menu_controller.js"

describe("ContextMenuController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--context-menu", ContextMenuController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createContextMenu(options = {}) {
    const { items = 3 } = options

    let itemsHtml = ""
    for (let i = 1; i <= items; i++) {
      itemsHtml += `<div role="menuitem" tabindex="-1" data-ui--context-menu-target="item" data-testid="item-${i}">Item ${i}</div>`
    }

    return `
      <div data-controller="ui--context-menu">
        <div data-ui--context-menu-target="trigger"
             data-action="contextmenu->ui--context-menu#open"
             data-testid="trigger"
             style="width: 200px; height: 100px; background: #eee;">
          Right click here
        </div>
        <div data-ui--context-menu-target="content"
             role="menu"
             data-state="closed"
             class="hidden"
             data-testid="content">
          ${itemsHtml}
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")

      expect(controller).not.toBeNull()
      expect(controller.openValue).toBe(false)
    })

    test("starts closed", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content = container.querySelector('[data-testid="content"]')
      expect(content.classList.contains("hidden")).toBe(true)
      expect(content.getAttribute("data-state")).toBe("closed")
    })

    test("has trigger and content targets", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")

      expect(controller.hasTriggerTarget).toBe(true)
      expect(controller.hasContentTarget).toBe(true)
    })
  })

  describe("Open", () => {
    test("opens on contextmenu event", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const content = container.querySelector('[data-testid="content"]')

      const event = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(event)
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(content.classList.contains("hidden")).toBe(false)
      expect(content.getAttribute("data-state")).toBe("open")
    })

    test("sets openValue to true", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")

      const event = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.openValue).toBe(true)
    })

    test("positions menu at cursor location", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const content = container.querySelector('[data-testid="content"]')

      const event = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 150,
        clientY: 200
      })
      controller.open(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.style.position).toBe("fixed")
      expect(content.style.left).toBe("150px")
      expect(content.style.top).toBe("200px")
    })
  })

  describe("Close", () => {
    test("closes menu", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const content = container.querySelector('[data-testid="content"]')

      // Open first
      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 150))

      // Then close
      controller.close()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.classList.contains("hidden")).toBe(true)
      expect(content.getAttribute("data-state")).toBe("closed")
    })

    test("sets openValue to false", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")

      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      controller.close()

      expect(controller.openValue).toBe(false)
    })

    test("resets all item tabindexes", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const items = container.querySelectorAll('[role="menuitem"]')

      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 150))

      controller.close()
      await new Promise(resolve => setTimeout(resolve, 10))

      items.forEach(item => {
        expect(item.getAttribute("tabindex")).toBe("-1")
      })
    })
  })

  describe("Click Outside", () => {
    test("closes menu when clicking outside", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const content = container.querySelector('[data-testid="content"]')

      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 150))

      // Click outside
      document.body.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.classList.contains("hidden")).toBe(true)
    })
  })

  describe("Keyboard Navigation", () => {
    test("ArrowDown moves focus to next item", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const items = container.querySelectorAll('[role="menuitem"]')

      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 150))

      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      document.dispatchEvent(downEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(items[1].getAttribute("tabindex")).toBe("0")
    })

    test("ArrowUp moves focus to previous item", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const items = container.querySelectorAll('[role="menuitem"]')

      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 150))

      // Go to second item first
      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      document.dispatchEvent(downEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Then go back up
      const upEvent = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
      document.dispatchEvent(upEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(items[0].getAttribute("tabindex")).toBe("0")
    })

    test("Home moves focus to first item", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const items = container.querySelectorAll('[role="menuitem"]')

      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 150))

      // Go to last item
      const endEvent = new KeyboardEvent("keydown", { key: "End", bubbles: true })
      document.dispatchEvent(endEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Press Home
      const homeEvent = new KeyboardEvent("keydown", { key: "Home", bubbles: true })
      document.dispatchEvent(homeEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(items[0].getAttribute("tabindex")).toBe("0")
    })

    test("End moves focus to last item", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const items = container.querySelectorAll('[role="menuitem"]')

      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 150))

      const endEvent = new KeyboardEvent("keydown", { key: "End", bubbles: true })
      document.dispatchEvent(endEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(items[items.length - 1].getAttribute("tabindex")).toBe("0")
    })

    test("Escape closes menu", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const content = container.querySelector('[data-testid="content"]')

      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 150))

      const escEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      document.dispatchEvent(escEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(content.classList.contains("hidden")).toBe(true)
    })

    test("Enter activates item and closes menu", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const content = container.querySelector('[data-testid="content"]')
      const items = container.querySelectorAll('[role="menuitem"]')

      let itemClicked = false
      items[0].addEventListener("click", () => { itemClicked = true })

      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 150))

      const enterEvent = new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      document.dispatchEvent(enterEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(itemClicked).toBe(true)
      expect(content.classList.contains("hidden")).toBe(true)
    })
  })

  describe("Focus Management", () => {
    test("first item gets focus when menu opens", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")
      const items = container.querySelectorAll('[role="menuitem"]')

      const openEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      })
      controller.open(openEvent)
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(items[0].getAttribute("tabindex")).toBe("0")
    })
  })

  describe("Disconnect", () => {
    test("removes event listeners on disconnect", async () => {
      container.innerHTML = createContextMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--context-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--context-menu")

      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Should not throw
      document.body.click()
    })
  })
})
