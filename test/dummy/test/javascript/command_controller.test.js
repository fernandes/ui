import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import CommandController from "../../../../app/javascript/ui/controllers/command_controller.js"

describe("CommandController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--command", CommandController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createCommand(options = {}) {
    const { loop = true, items = ["apple", "banana", "cherry"] } = options

    const itemsHtml = items.map((item, index) => `
      <div data-ui--command-target="item"
           data-value="${item}"
           data-testid="item-${index}"
           role="option">
        ${item.charAt(0).toUpperCase() + item.slice(1)}
      </div>
    `).join("")

    return `
      <div data-controller="ui--command"
           data-ui--command-loop-value="${loop}"
           data-testid="command">
        <input data-ui--command-target="input"
               data-action="input->ui--command#filter keydown->ui--command#handleKeydown"
               data-testid="input" />
        <div data-ui--command-target="list" data-testid="list" role="listbox">
          <div data-ui--command-target="group" data-testid="group">
            ${itemsHtml}
          </div>
        </div>
        <div data-ui--command-target="empty" class="hidden" data-testid="empty">
          No results found.
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects successfully", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      expect(controller).not.toBeNull()
    })

    test("has input target", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      expect(controller.hasInputTarget).toBe(true)
    })

    test("has item targets", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      expect(controller.itemTargets.length).toBe(3)
    })

    test("has loop value", async () => {
      container.innerHTML = createCommand({ loop: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      expect(controller.loopValue).toBe(true)
    })

    test("starts with selectedIndex -1", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      expect(controller.selectedIndex).toBe(-1)
    })
  })

  describe("Filtering", () => {
    test("filters items by value", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")
      const input = container.querySelector('[data-testid="input"]')

      input.value = "app"
      controller.filter()
      await new Promise(resolve => setTimeout(resolve, 10))

      const visibleItems = controller.visibleItems
      expect(visibleItems.length).toBe(1)
    })

    test("shows all items when filter is empty", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")
      const input = container.querySelector('[data-testid="input"]')

      input.value = ""
      controller.filter()
      await new Promise(resolve => setTimeout(resolve, 10))

      const visibleItems = controller.visibleItems
      expect(visibleItems.length).toBe(3)
    })

    test("shows empty state when no matches", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")
      const input = container.querySelector('[data-testid="input"]')
      const empty = container.querySelector('[data-testid="empty"]')

      input.value = "xyz"
      controller.filter()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(empty.classList.contains("hidden")).toBe(false)
    })

    test("resets selection when filtering", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")
      const input = container.querySelector('[data-testid="input"]')

      controller.selectedIndex = 1
      input.value = "ban"
      controller.filter()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedIndex).toBe(-1)
    })
  })

  describe("Keyboard Navigation", () => {
    test("ArrowDown selects next item", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      const mockEvent = {
        key: "ArrowDown",
        preventDefault: () => {}
      }
      controller.handleKeydown(mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedIndex).toBe(0)
    })

    test("ArrowUp selects previous item", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      controller.selectedIndex = 1
      const mockEvent = {
        key: "ArrowUp",
        preventDefault: () => {}
      }
      controller.handleKeydown(mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedIndex).toBe(0)
    })

    test("Home selects first item", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      controller.selectedIndex = 2
      const mockEvent = {
        key: "Home",
        preventDefault: () => {}
      }
      controller.handleKeydown(mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedIndex).toBe(0)
    })

    test("End selects last item", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      controller.selectedIndex = 0
      const mockEvent = {
        key: "End",
        preventDefault: () => {}
      }
      controller.handleKeydown(mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedIndex).toBe(2)
    })

    test("loops from last to first item when loop is true", async () => {
      container.innerHTML = createCommand({ loop: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      controller.selectedIndex = 2
      const mockEvent = {
        key: "ArrowDown",
        preventDefault: () => {}
      }
      controller.handleKeydown(mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedIndex).toBe(0)
    })

    test("does not loop when loop is false", async () => {
      container.innerHTML = createCommand({ loop: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      controller.selectedIndex = 2
      const mockEvent = {
        key: "ArrowDown",
        preventDefault: () => {}
      }
      controller.handleKeydown(mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedIndex).toBe(2)
    })
  })

  describe("Selection", () => {
    test("Enter triggers select on current item", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      let eventFired = false
      let eventValue = null
      element.addEventListener("command:select", (e) => {
        eventFired = true
        eventValue = e.detail.value
      })

      controller.selectedIndex = 0
      const mockEvent = {
        key: "Enter",
        preventDefault: () => {}
      }
      controller.handleKeydown(mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
      expect(eventValue).toBe("apple")
    })

    test("click triggers select", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")
      const item = container.querySelector('[data-testid="item-1"]')

      let eventFired = false
      let eventValue = null
      element.addEventListener("command:select", (e) => {
        eventFired = true
        eventValue = e.detail.value
      })

      controller.select({ currentTarget: item })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
      expect(eventValue).toBe("banana")
    })
  })

  describe("Update Selection", () => {
    test("sets aria-selected on selected item", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      controller.selectedIndex = 1
      controller.updateSelection()
      await new Promise(resolve => setTimeout(resolve, 10))

      const selectedItem = container.querySelector('[data-testid="item-1"]')
      expect(selectedItem.getAttribute("aria-selected")).toBe("true")
    })

    test("sets data-selected on selected item", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      controller.selectedIndex = 1
      controller.updateSelection()
      await new Promise(resolve => setTimeout(resolve, 10))

      const selectedItem = container.querySelector('[data-testid="item-1"]')
      expect(selectedItem.dataset.selected).toBe("true")
    })
  })

  describe("Visible Items", () => {
    test("returns only visible items", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      // Hide one item
      const item0 = container.querySelector('[data-testid="item-0"]')
      item0.hidden = true

      const visibleItems = controller.visibleItems
      expect(visibleItems.length).toBe(2)
    })

    test("excludes disabled items", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      // Disable one item
      const item0 = container.querySelector('[data-testid="item-0"]')
      item0.dataset.disabled = "true"

      const visibleItems = controller.visibleItems
      expect(visibleItems.length).toBe(2)
    })
  })

  describe("Disconnect", () => {
    test("cleans up on disconnect", async () => {
      container.innerHTML = createCommand()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="command"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--command")

      // Should not throw
      controller.disconnect()
    })
  })
})
