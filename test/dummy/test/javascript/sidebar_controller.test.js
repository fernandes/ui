import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import SidebarController from "../../../../app/javascript/ui/controllers/sidebar_controller.js"

describe("SidebarController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--sidebar", SidebarController)
    container = document.createElement("div")
    document.body.appendChild(container)

    // Mock window.innerWidth for mobile detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
    document.cookie = "sidebar_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  })

  function createSidebar(options = {}) {
    const {
      open = true,
      collapsible = "icon",
      side = "left"
    } = options

    return `
      <div data-controller="ui--sidebar"
           data-ui--sidebar-open-value="${open}"
           data-ui--sidebar-collapsible-value="${collapsible}"
           data-ui--sidebar-side-value="${side}"
           data-testid="sidebar-provider">
        <aside data-ui--sidebar-target="sidebar" data-testid="sidebar">
          <nav>Sidebar Content</nav>
        </aside>
        <button data-ui--sidebar-target="trigger"
                data-action="click->ui--sidebar#toggle"
                data-testid="trigger">
          Toggle
        </button>
        <main>Main Content</main>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createSidebar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      expect(controller).not.toBeNull()
      expect(controller.openValue).toBe(true)
      expect(controller.collapsibleValue).toBe("icon")
      expect(controller.sideValue).toBe("left")
    })

    test("sets initial data-state", async () => {
      container.innerHTML = createSidebar({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      expect(element.dataset.state).toBe("expanded")
    })

    test("sets collapsed state when open is false", async () => {
      container.innerHTML = createSidebar({ open: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      expect(element.dataset.state).toBe("collapsed")
    })

    test("has sidebar target", async () => {
      container.innerHTML = createSidebar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      expect(controller.hasSidebarTarget).toBe(true)
    })
  })

  describe("Toggle Desktop", () => {
    test("toggleDesktop toggles open state", async () => {
      container.innerHTML = createSidebar({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      controller.toggleDesktop()

      expect(controller.openValue).toBe(false)
      expect(element.dataset.state).toBe("collapsed")
    })

    test("toggleDesktop back to open", async () => {
      container.innerHTML = createSidebar({ open: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      controller.toggleDesktop()

      expect(controller.openValue).toBe(true)
      expect(element.dataset.state).toBe("expanded")
    })
  })

  describe("Open/Close Desktop", () => {
    test("openDesktop sets state to expanded", async () => {
      container.innerHTML = createSidebar({ open: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      controller.openDesktop()

      expect(controller.openValue).toBe(true)
      expect(element.dataset.state).toBe("expanded")
    })

    test("closeDesktop sets state to collapsed", async () => {
      container.innerHTML = createSidebar({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      controller.closeDesktop()

      expect(controller.openValue).toBe(false)
      expect(element.dataset.state).toBe("collapsed")
    })
  })

  describe("State Helpers", () => {
    test("getState returns expanded when open", async () => {
      container.innerHTML = createSidebar({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      expect(controller.getState()).toBe("expanded")
    })

    test("getState returns collapsed when closed", async () => {
      container.innerHTML = createSidebar({ open: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      expect(controller.getState()).toBe("collapsed")
    })

    test("getState returns expanded when collapsible is none", async () => {
      container.innerHTML = createSidebar({ open: false, collapsible: "none" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      expect(controller.getState()).toBe("expanded")
    })
  })

  describe("Mobile Detection", () => {
    test("isMobile returns true for small screens", async () => {
      container.innerHTML = createSidebar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      window.innerWidth = 500
      expect(controller.isMobile()).toBe(true)
    })

    test("isMobile returns false for large screens", async () => {
      container.innerHTML = createSidebar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      window.innerWidth = 1024
      expect(controller.isMobile()).toBe(false)
    })
  })

  describe("Keyboard Shortcut", () => {
    test("Cmd/Ctrl + B toggles sidebar", async () => {
      container.innerHTML = createSidebar({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      // Ensure we're on desktop
      window.innerWidth = 1024

      const event = new KeyboardEvent("keydown", {
        key: "b",
        ctrlKey: true,
        bubbles: true
      })
      document.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.openValue).toBe(false)
    })
  })

  describe("Events", () => {
    test("dispatches sidebar:toggle event", async () => {
      container.innerHTML = createSidebar({ open: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      let eventFired = false
      let eventDetail = null
      element.addEventListener("sidebar:toggle", (e) => {
        eventFired = true
        eventDetail = e.detail
      })

      controller.toggleDesktop()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
      expect(eventDetail.open).toBe(false)
      expect(eventDetail.state).toBe("collapsed")
    })
  })

  describe("Data Attributes", () => {
    test("sets data-collapsible when collapsed", async () => {
      container.innerHTML = createSidebar({ open: false, collapsible: "icon" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      expect(element.dataset.collapsible).toBe("icon")
    })

    test("clears data-collapsible when expanded", async () => {
      container.innerHTML = createSidebar({ open: true, collapsible: "icon" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      expect(element.dataset.collapsible).toBe("")
    })

    test("sets data-side attribute", async () => {
      container.innerHTML = createSidebar({ side: "right" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      expect(element.dataset.side).toBe("right")
    })
  })

  describe("Disconnect", () => {
    test("removes event listeners on disconnect", async () => {
      container.innerHTML = createSidebar()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="sidebar-provider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--sidebar")

      controller.disconnect()

      // Should not throw when dispatching events after disconnect
      const event = new KeyboardEvent("keydown", {
        key: "b",
        ctrlKey: true,
        bubbles: true
      })
      document.dispatchEvent(event)
    })
  })
})
