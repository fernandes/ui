import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import NavigationMenuController from "../../../../app/javascript/ui/controllers/navigation_menu_controller.js"

describe("NavigationMenuController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--navigation-menu", NavigationMenuController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createNavigationMenu(options = {}) {
    const { viewport = true, delayDuration = 200 } = options

    return `
      <nav data-controller="ui--navigation-menu"
           data-ui--navigation-menu-viewport-value="${viewport}"
           data-ui--navigation-menu-delay-duration-value="${delayDuration}"
           data-testid="navigation-menu">
        <ul>
          <li>
            <button data-ui--navigation-menu-target="trigger"
                    data-action="mouseenter->ui--navigation-menu#handleTriggerHover mouseleave->ui--navigation-menu#handleTriggerLeave click->ui--navigation-menu#toggle"
                    data-state="closed"
                    aria-expanded="false"
                    data-testid="trigger-0">
              Products
            </button>
            <div data-ui--navigation-menu-target="content"
                 data-state="closed"
                 data-testid="content-0">
              <a href="#" data-testid="link-0">Product 1</a>
              <a href="#" data-testid="link-1">Product 2</a>
            </div>
          </li>
          <li>
            <button data-ui--navigation-menu-target="trigger"
                    data-action="mouseenter->ui--navigation-menu#handleTriggerHover mouseleave->ui--navigation-menu#handleTriggerLeave click->ui--navigation-menu#toggle"
                    data-state="closed"
                    aria-expanded="false"
                    data-testid="trigger-1">
              Services
            </button>
            <div data-ui--navigation-menu-target="content"
                 data-state="closed"
                 data-testid="content-1">
              <a href="#" data-testid="link-2">Service 1</a>
              <a href="#" data-testid="link-3">Service 2</a>
            </div>
          </li>
        </ul>
        <div data-ui--navigation-menu-target="viewport"
             data-state="closed"
             data-testid="viewport">
        </div>
      </nav>
    `
  }

  describe("Initialization", () => {
    test("connects successfully", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      expect(controller).not.toBeNull()
    })

    test("has trigger targets", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      expect(controller.triggerTargets.length).toBe(2)
    })

    test("has content targets", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      expect(controller.contentTargets.length).toBe(2)
    })

    test("has viewport target", async () => {
      container.innerHTML = createNavigationMenu({ viewport: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      expect(controller.hasViewportTarget).toBe(true)
    })

    test("respects delayDuration value", async () => {
      container.innerHTML = createNavigationMenu({ delayDuration: 300 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      expect(controller.delayDurationValue).toBe(300)
    })

    test("initializes triggers with tabindex", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger0 = container.querySelector('[data-testid="trigger-0"]')
      const trigger1 = container.querySelector('[data-testid="trigger-1"]')

      expect(trigger0.getAttribute("tabindex")).toBe("0")
      expect(trigger1.getAttribute("tabindex")).toBe("-1")
    })

    test("starts with activeIndex -1", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      expect(controller.activeIndexValue).toBe(-1)
    })

    test("starts with isMenuActive false", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      expect(controller.isMenuActive).toBe(false)
    })
  })

  describe("Menu Open/Close", () => {
    test("openMenu opens the specified menu", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")
      const trigger0 = container.querySelector('[data-testid="trigger-0"]')
      const content0 = container.querySelector('[data-testid="content-0"]')

      controller.openMenu(0)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.activeIndexValue).toBe(0)
      expect(controller.isMenuActive).toBe(true)
      expect(trigger0.getAttribute("data-state")).toBe("open")
      expect(content0.getAttribute("data-state")).toBe("open")
    })

    test("closeMenu closes the active menu", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      controller.openMenu(0)
      await new Promise(resolve => setTimeout(resolve, 10))

      controller.closeMenu()
      await new Promise(resolve => setTimeout(resolve, 500)) // Wait for animation

      expect(controller.activeIndexValue).toBe(-1)
      expect(controller.isMenuActive).toBe(false)
    })

    test("closeAll closes all menus", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      controller.openMenu(0)
      await new Promise(resolve => setTimeout(resolve, 10))

      controller.closeAll()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.activeIndexValue).toBe(-1)
      expect(controller.isMenuActive).toBe(false)
    })
  })

  describe("Toggle", () => {
    test("toggle opens menu when closed", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")
      const trigger0 = container.querySelector('[data-testid="trigger-0"]')

      controller.toggle({ currentTarget: trigger0 })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.isMenuActive).toBe(true)
    })

    test("toggle closes menu when open", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")
      const trigger0 = container.querySelector('[data-testid="trigger-0"]')

      controller.openMenu(0)
      await new Promise(resolve => setTimeout(resolve, 10))

      controller.toggle({ currentTarget: trigger0 })
      await new Promise(resolve => setTimeout(resolve, 500))

      expect(controller.isMenuActive).toBe(false)
    })
  })

  describe("Motion Calculation", () => {
    test("calculateEnterMotion returns from-none for first menu", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      const motion = controller.calculateEnterMotion(0)

      expect(motion).toBe("from-none")
    })

    test("calculateEnterMotion returns from-end when moving right", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      controller.activeIndexValue = 0
      const motion = controller.calculateEnterMotion(1)

      expect(motion).toBe("from-end")
    })

    test("calculateEnterMotion returns from-start when moving left", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      controller.activeIndexValue = 1
      const motion = controller.calculateEnterMotion(0)

      expect(motion).toBe("from-start")
    })

    test("calculateExitMotion returns to-start when moving right", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      controller.activeIndexValue = 0
      const motion = controller.calculateExitMotion(1)

      expect(motion).toBe("to-start")
    })

    test("calculateExitMotion returns to-end when moving left", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      controller.activeIndexValue = 1
      const motion = controller.calculateExitMotion(0)

      expect(motion).toBe("to-end")
    })
  })

  describe("Trigger Navigation", () => {
    test("focusTrigger focuses and sets tabindex", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")
      const trigger0 = container.querySelector('[data-testid="trigger-0"]')
      const trigger1 = container.querySelector('[data-testid="trigger-1"]')

      controller.focusTrigger(1)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(trigger0.getAttribute("tabindex")).toBe("-1")
      expect(trigger1.getAttribute("tabindex")).toBe("0")
    })

    test("focusNextTrigger wraps around", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      controller.focusNextTrigger(1)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger0 = container.querySelector('[data-testid="trigger-0"]')
      expect(trigger0.getAttribute("tabindex")).toBe("0")
    })

    test("focusPreviousTrigger wraps around", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      controller.focusPreviousTrigger(0)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-1"]')
      expect(trigger1.getAttribute("tabindex")).toBe("0")
    })
  })

  describe("Clear Timers", () => {
    test("clearTimers clears all timers", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      // Set some timers
      controller.openTimerRef = setTimeout(() => {}, 1000)
      controller.closeTimerRef = setTimeout(() => {}, 1000)
      controller.skipDelayTimerRef = setTimeout(() => {}, 1000)

      controller.clearTimers()

      expect(controller.openTimerRef).toBeNull()
      expect(controller.closeTimerRef).toBeNull()
      expect(controller.skipDelayTimerRef).toBeNull()
    })
  })

  describe("Disconnect", () => {
    test("cleans up on disconnect", async () => {
      container.innerHTML = createNavigationMenu()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="navigation-menu"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--navigation-menu")

      // Should not throw
      controller.disconnect()
    })
  })
})
