import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import TabsController from "../../../../app/javascript/ui/controllers/tabs_controller.js"

describe("TabsController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--tabs", TabsController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  // Helper to create tabs HTML
  function createTabs(options = {}) {
    const {
      defaultValue = "tab1",
      orientation = "horizontal",
      activationMode = "automatic"
    } = options

    return `
      <div data-controller="ui--tabs"
           data-ui--tabs-default-value-value="${defaultValue}"
           data-ui--tabs-orientation-value="${orientation}"
           data-ui--tabs-activation-mode-value="${activationMode}">
        <div role="tablist" data-testid="tablist">
          <button role="tab"
                  data-ui--tabs-target="trigger"
                  data-value="tab1"
                  data-action="click->ui--tabs#selectTab"
                  aria-selected="false"
                  data-testid="trigger-tab1">
            Tab 1
          </button>
          <button role="tab"
                  data-ui--tabs-target="trigger"
                  data-value="tab2"
                  data-action="click->ui--tabs#selectTab"
                  aria-selected="false"
                  data-testid="trigger-tab2">
            Tab 2
          </button>
          <button role="tab"
                  data-ui--tabs-target="trigger"
                  data-value="tab3"
                  data-action="click->ui--tabs#selectTab"
                  aria-selected="false"
                  data-testid="trigger-tab3">
            Tab 3
          </button>
        </div>
        <div role="tabpanel"
             data-ui--tabs-target="content"
             data-value="tab1"
             data-testid="content-tab1">
          Content 1
        </div>
        <div role="tabpanel"
             data-ui--tabs-target="content"
             data-value="tab2"
             data-testid="content-tab2">
          Content 2
        </div>
        <div role="tabpanel"
             data-ui--tabs-target="content"
             data-value="tab3"
             data-testid="content-tab3">
          Content 3
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createTabs()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--tabs"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--tabs")

      expect(controller).not.toBeNull()
      expect(controller.defaultValueValue).toBe("tab1")
      expect(controller.orientationValue).toBe("horizontal")
      expect(controller.activationModeValue).toBe("automatic")
    })

    test("activates default tab on connect", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      const content1 = container.querySelector('[data-testid="content-tab1"]')

      expect(trigger1.dataset.state).toBe("active")
      expect(trigger1.getAttribute("aria-selected")).toBe("true")
      expect(content1.dataset.state).toBe("active")
    })

    test("hides non-active tabs on connect", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const content2 = container.querySelector('[data-testid="content-tab2"]')
      const content3 = container.querySelector('[data-testid="content-tab3"]')

      expect(content2.dataset.state).toBe("inactive")
      expect(content2.hasAttribute("hidden")).toBe(true)
      expect(content3.dataset.state).toBe("inactive")
      expect(content3.hasAttribute("hidden")).toBe(true)
    })

    test("activates different default tab", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab2" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger2 = container.querySelector('[data-testid="trigger-tab2"]')
      const content2 = container.querySelector('[data-testid="content-tab2"]')

      expect(trigger2.dataset.state).toBe("active")
      expect(content2.dataset.state).toBe("active")
    })
  })

  describe("Tab selection", () => {
    test("switches tabs on click", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger2 = container.querySelector('[data-testid="trigger-tab2"]')
      trigger2.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      const content1 = container.querySelector('[data-testid="content-tab1"]')
      const content2 = container.querySelector('[data-testid="content-tab2"]')

      // Tab 1 should be inactive
      expect(trigger1.dataset.state).toBe("inactive")
      expect(trigger1.getAttribute("aria-selected")).toBe("false")
      expect(content1.dataset.state).toBe("inactive")
      expect(content1.hasAttribute("hidden")).toBe(true)

      // Tab 2 should be active
      expect(trigger2.dataset.state).toBe("active")
      expect(trigger2.getAttribute("aria-selected")).toBe("true")
      expect(content2.dataset.state).toBe("active")
      expect(content2.hasAttribute("hidden")).toBe(false)
    })

    test("updates tabindex when switching tabs", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      const trigger2 = container.querySelector('[data-testid="trigger-tab2"]')

      // Active tab has tabindex 0
      expect(trigger1.getAttribute("tabindex")).toBe("0")

      trigger2.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      // After clicking tab2, it should be active with tabindex 0
      expect(trigger2.getAttribute("tabindex")).toBe("0")
      // Tab1 should now have tabindex -1
      expect(trigger1.getAttribute("tabindex")).toBe("-1")
    })
  })

  describe("Keyboard navigation - horizontal", () => {
    test("navigates right with ArrowRight", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1", orientation: "horizontal" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      trigger1.focus()

      const arrowRightEvent = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      trigger1.dispatchEvent(arrowRightEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger2 = container.querySelector('[data-testid="trigger-tab2"]')
      expect(document.activeElement).toBe(trigger2)
    })

    test("navigates left with ArrowLeft", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab2", orientation: "horizontal" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger2 = container.querySelector('[data-testid="trigger-tab2"]')
      trigger2.focus()

      const arrowLeftEvent = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
      trigger2.dispatchEvent(arrowLeftEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      expect(document.activeElement).toBe(trigger1)
    })

    test("wraps around when navigating right at end", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab3", orientation: "horizontal" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger3 = container.querySelector('[data-testid="trigger-tab3"]')
      trigger3.focus()

      const arrowRightEvent = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      trigger3.dispatchEvent(arrowRightEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      expect(document.activeElement).toBe(trigger1)
    })

    test("wraps around when navigating left at start", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1", orientation: "horizontal" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      trigger1.focus()

      const arrowLeftEvent = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
      trigger1.dispatchEvent(arrowLeftEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger3 = container.querySelector('[data-testid="trigger-tab3"]')
      expect(document.activeElement).toBe(trigger3)
    })

    test("ignores ArrowUp/ArrowDown in horizontal mode", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1", orientation: "horizontal" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      trigger1.focus()

      const arrowDownEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      trigger1.dispatchEvent(arrowDownEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.activeElement).toBe(trigger1)
    })
  })

  describe("Keyboard navigation - vertical", () => {
    test("navigates down with ArrowDown", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1", orientation: "vertical" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      trigger1.focus()

      const arrowDownEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      trigger1.dispatchEvent(arrowDownEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger2 = container.querySelector('[data-testid="trigger-tab2"]')
      expect(document.activeElement).toBe(trigger2)
    })

    test("navigates up with ArrowUp", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab2", orientation: "vertical" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger2 = container.querySelector('[data-testid="trigger-tab2"]')
      trigger2.focus()

      const arrowUpEvent = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
      trigger2.dispatchEvent(arrowUpEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      expect(document.activeElement).toBe(trigger1)
    })

    test("ignores ArrowLeft/ArrowRight in vertical mode", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1", orientation: "vertical" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      trigger1.focus()

      const arrowRightEvent = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      trigger1.dispatchEvent(arrowRightEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(document.activeElement).toBe(trigger1)
    })
  })

  describe("Home and End keys", () => {
    test("navigates to first tab with Home", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab3" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger3 = container.querySelector('[data-testid="trigger-tab3"]')
      trigger3.focus()

      const homeEvent = new KeyboardEvent("keydown", { key: "Home", bubbles: true })
      trigger3.dispatchEvent(homeEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      expect(document.activeElement).toBe(trigger1)
    })

    test("navigates to last tab with End", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      trigger1.focus()

      const endEvent = new KeyboardEvent("keydown", { key: "End", bubbles: true })
      trigger1.dispatchEvent(endEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger3 = container.querySelector('[data-testid="trigger-tab3"]')
      expect(document.activeElement).toBe(trigger3)
    })
  })

  describe("Activation modes", () => {
    test("automatic mode activates tab on focus", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1", activationMode: "automatic" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      trigger1.focus()

      const arrowRightEvent = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      trigger1.dispatchEvent(arrowRightEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger2 = container.querySelector('[data-testid="trigger-tab2"]')
      const content2 = container.querySelector('[data-testid="content-tab2"]')

      // In automatic mode, focusing should also activate
      expect(trigger2.dataset.state).toBe("active")
      expect(content2.dataset.state).toBe("active")
    })

    test("manual mode does not activate tab on focus", async () => {
      container.innerHTML = createTabs({ defaultValue: "tab1", activationMode: "manual" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')
      trigger1.focus()

      const arrowRightEvent = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      trigger1.dispatchEvent(arrowRightEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger2 = container.querySelector('[data-testid="trigger-tab2"]')
      const content1 = container.querySelector('[data-testid="content-tab1"]')

      // In manual mode, focus changes but activation doesn't
      expect(document.activeElement).toBe(trigger2)
      expect(trigger1.dataset.state).toBe("active") // Still active
      expect(content1.dataset.state).toBe("active") // Still showing
    })
  })

  describe("ARIA attributes", () => {
    test("trigger has correct ARIA attributes", async () => {
      container.innerHTML = createTabs()
      await new Promise(resolve => setTimeout(resolve, 10))

      const trigger1 = container.querySelector('[data-testid="trigger-tab1"]')

      expect(trigger1.getAttribute("role")).toBe("tab")
      expect(trigger1.getAttribute("aria-selected")).toBe("true")
      expect(trigger1.getAttribute("tabindex")).toBe("0")
    })

    test("content has tabpanel role", async () => {
      container.innerHTML = createTabs()
      await new Promise(resolve => setTimeout(resolve, 10))

      const content1 = container.querySelector('[data-testid="content-tab1"]')
      expect(content1.getAttribute("role")).toBe("tabpanel")
    })
  })
})
