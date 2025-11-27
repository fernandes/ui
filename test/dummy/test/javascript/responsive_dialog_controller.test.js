import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import ResponsiveDialogController from "../../../../app/javascript/ui/controllers/responsive_dialog_controller.js"

describe("ResponsiveDialogController", () => {
  let application
  let container
  let originalMatchMedia

  beforeEach(() => {
    application = Application.start()
    application.register("ui--responsive-dialog", ResponsiveDialogController)
    container = document.createElement("div")
    document.body.appendChild(container)

    // Store original matchMedia
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
    // Restore original matchMedia
    window.matchMedia = originalMatchMedia
  })

  // Helper to mock matchMedia
  function mockMatchMedia(matches) {
    const listeners = []
    window.matchMedia = (query) => ({
      matches: matches,
      media: query,
      onchange: null,
      addListener: (fn) => listeners.push(fn),
      removeListener: (fn) => {
        const index = listeners.indexOf(fn)
        if (index > -1) listeners.splice(index, 1)
      },
      addEventListener: (event, fn) => listeners.push(fn),
      removeEventListener: (event, fn) => {
        const index = listeners.indexOf(fn)
        if (index > -1) listeners.splice(index, 1)
      },
      dispatchEvent: (event) => {
        listeners.forEach(fn => fn(event))
        return true
      },
      _triggerChange: (newMatches) => {
        listeners.forEach(fn => fn({ matches: newMatches }))
      },
      _listeners: listeners
    })
  }

  // Helper to create responsive dialog HTML
  function createResponsiveDialog(options = {}) {
    const {
      breakpoint = 768,
      open = false
    } = options

    return `
      <div data-controller="ui--responsive-dialog"
           data-ui--responsive-dialog-breakpoint-value="${breakpoint}"
           data-ui--responsive-dialog-open-value="${open}">
        <button data-action="click->ui--responsive-dialog#open" data-testid="trigger">
          Open
        </button>

        <!-- Desktop: Dialog -->
        <div data-ui--responsive-dialog-target="dialog"
             class="hidden md:block"
             data-testid="dialog">
          <div data-state="closed">Desktop Dialog Content</div>
        </div>

        <!-- Mobile: Drawer -->
        <div data-ui--responsive-dialog-target="drawer"
             class="block md:hidden"
             data-testid="drawer">
          <div data-state="closed">Mobile Drawer Content</div>
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      mockMatchMedia(true) // Desktop
      container.innerHTML = createResponsiveDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      expect(controller).not.toBeNull()
      expect(controller.breakpointValue).toBe(768)
      expect(controller.openValue).toBe(false)
    })

    test("detects desktop mode when above breakpoint", async () => {
      mockMatchMedia(true) // Desktop
      container.innerHTML = createResponsiveDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      expect(controller.isDesktop).toBe(true)
      expect(controller.isMobile).toBe(false)
      expect(controller.activeComponentType).toBe("dialog")
    })

    test("detects mobile mode when below breakpoint", async () => {
      mockMatchMedia(false) // Mobile
      container.innerHTML = createResponsiveDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      expect(controller.isDesktop).toBe(false)
      expect(controller.isMobile).toBe(true)
      expect(controller.activeComponentType).toBe("drawer")
    })
  })

  describe("Open/Close", () => {
    test("opens on desktop", async () => {
      mockMatchMedia(true) // Desktop
      container.innerHTML = createResponsiveDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      let dialogOpenEventFired = false
      const dialog = container.querySelector('[data-testid="dialog"]')
      dialog.addEventListener("dialog:open", () => {
        dialogOpenEventFired = true
      })

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      expect(controller.openValue).toBe(true)
      expect(dialogOpenEventFired).toBe(true)
    })

    test("opens on mobile", async () => {
      mockMatchMedia(false) // Mobile
      container.innerHTML = createResponsiveDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      let drawerOpenEventFired = false
      const drawer = container.querySelector('[data-testid="drawer"]')
      drawer.addEventListener("drawer:open", () => {
        drawerOpenEventFired = true
      })

      const trigger = container.querySelector('[data-testid="trigger"]')
      trigger.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      expect(controller.openValue).toBe(true)
      expect(drawerOpenEventFired).toBe(true)
    })

    test("closes component", async () => {
      mockMatchMedia(true) // Desktop
      container.innerHTML = createResponsiveDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      // Open first
      controller.open()
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(controller.openValue).toBe(true)

      // Close
      controller.close()
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(controller.openValue).toBe(false)
    })

    test("toggles component", async () => {
      mockMatchMedia(true) // Desktop
      container.innerHTML = createResponsiveDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      expect(controller.openValue).toBe(false)

      controller.toggle()
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(controller.openValue).toBe(true)

      controller.toggle()
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(controller.openValue).toBe(false)
    })
  })

  describe("Breakpoint handling", () => {
    test("syncs state when breakpoint changes", async () => {
      mockMatchMedia(true) // Start as desktop
      container.innerHTML = createResponsiveDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      // Open while on desktop
      controller.open()
      await new Promise(resolve => setTimeout(resolve, 10))

      let drawerOpenEventFired = false

      const drawer = container.querySelector('[data-testid="drawer"]')
      drawer.addEventListener("drawer:open", () => {
        drawerOpenEventFired = true
      })

      // Mock mediaQuery to return mobile
      controller.mediaQuery = { matches: false }

      // Simulate breakpoint change to mobile
      controller.handleBreakpointChange({ matches: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      // Should open drawer when switching to mobile while open
      expect(drawerOpenEventFired).toBe(true)
    })

    test("dispatches resize event on breakpoint change", async () => {
      mockMatchMedia(true) // Start as desktop
      container.innerHTML = createResponsiveDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      let resizeEventFired = false
      let eventDetail = null
      element.addEventListener("responsive-dialog:resize", (e) => {
        resizeEventFired = true
        eventDetail = e.detail
      })

      // Simulate breakpoint change to mobile
      controller.handleBreakpointChange({ matches: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(resizeEventFired).toBe(true)
      expect(eventDetail.isDesktop).toBe(false)
      expect(eventDetail.breakpoint).toBe(768)
    })
  })

  describe("Custom breakpoint", () => {
    test("respects custom breakpoint value", async () => {
      mockMatchMedia(true)
      container.innerHTML = createResponsiveDialog({ breakpoint: 1024 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      expect(controller.breakpointValue).toBe(1024)
    })
  })

  describe("Disconnect", () => {
    test("removes media query listener on disconnect", async () => {
      mockMatchMedia(true)
      container.innerHTML = createResponsiveDialog()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--responsive-dialog"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--responsive-dialog")

      // Disconnect should not throw
      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))
    })
  })
})
