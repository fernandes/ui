import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import ScrollAreaController from "../../../../app/javascript/ui/controllers/scroll_area_controller.js"

describe("ScrollAreaController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--scroll-area", ScrollAreaController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createScrollArea(options = {}) {
    const { type = "hover", orientation = "vertical" } = options

    return `
      <div data-controller="ui--scroll-area"
           data-ui--scroll-area-type-value="${type}"
           data-testid="scroll-area"
           style="width: 200px; height: 200px; position: relative;">
        <div data-ui--scroll-area-target="viewport"
             data-testid="viewport"
             style="width: 100%; height: 100%; overflow: hidden;">
          <div style="height: 500px; width: 500px;">
            Scrollable content that is taller and wider than the viewport
          </div>
        </div>
        <div data-ui--scroll-area-target="scrollbar"
             data-orientation="${orientation}"
             data-testid="scrollbar"
             style="position: absolute; right: 0; top: 0; width: 12px; height: 100%;">
          <div data-ui--scroll-area-target="thumb"
               data-action="pointerdown->ui--scroll-area#startDrag"
               data-testid="thumb"
               style="position: absolute; width: 100%; height: 50px; background: #888;">
          </div>
        </div>
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects successfully", async () => {
      container.innerHTML = createScrollArea()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="scroll-area"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--scroll-area")

      expect(controller).not.toBeNull()
    })

    test("respects type value", async () => {
      container.innerHTML = createScrollArea({ type: "always" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="scroll-area"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--scroll-area")

      expect(controller.typeValue).toBe("always")
    })

    test("has viewport target", async () => {
      container.innerHTML = createScrollArea()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="scroll-area"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--scroll-area")

      expect(controller.hasViewportTarget).toBe(true)
    })

    test("has scrollbar targets", async () => {
      container.innerHTML = createScrollArea()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="scroll-area"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--scroll-area")

      expect(controller.scrollbarTargets.length).toBe(1)
    })

    test("has thumb targets", async () => {
      container.innerHTML = createScrollArea()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="scroll-area"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--scroll-area")

      expect(controller.thumbTargets.length).toBe(1)
    })
  })

  describe("Viewport Overflow", () => {
    test("sets vertical overflow for vertical scrollbar", async () => {
      container.innerHTML = createScrollArea({ orientation: "vertical" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const viewport = container.querySelector('[data-testid="viewport"]')
      expect(viewport.style.overflowY).toBe("scroll")
    })

    test("sets horizontal overflow for horizontal scrollbar", async () => {
      container.innerHTML = `
        <div data-controller="ui--scroll-area"
             data-ui--scroll-area-type-value="hover"
             data-testid="scroll-area"
             style="width: 200px; height: 200px; position: relative;">
          <div data-ui--scroll-area-target="viewport"
               data-testid="viewport"
               style="width: 100%; height: 100%; overflow: hidden;">
            <div style="height: 100px; width: 500px;">Wide content</div>
          </div>
          <div data-ui--scroll-area-target="scrollbar"
               data-orientation="horizontal"
               data-testid="scrollbar">
            <div data-ui--scroll-area-target="thumb" data-testid="thumb"></div>
          </div>
        </div>
      `
      await new Promise(resolve => setTimeout(resolve, 10))

      const viewport = container.querySelector('[data-testid="viewport"]')
      expect(viewport.style.overflowX).toBe("scroll")
    })
  })

  describe("Scrollbar Types", () => {
    test("hover type starts with hidden state", async () => {
      container.innerHTML = createScrollArea({ type: "hover" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const scrollbar = container.querySelector('[data-testid="scrollbar"]')
      expect(scrollbar.dataset.state).toBe("hidden")
    })

    test("scroll type starts with hidden state", async () => {
      container.innerHTML = createScrollArea({ type: "scroll" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const scrollbar = container.querySelector('[data-testid="scrollbar"]')
      expect(scrollbar.dataset.state).toBe("hidden")
    })
  })

  describe("Dragging State", () => {
    test("starts with isDragging false", async () => {
      container.innerHTML = createScrollArea()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="scroll-area"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--scroll-area")

      expect(controller.isDragging).toBe(false)
    })
  })

  describe("Disconnect", () => {
    test("cleans up animation frame on disconnect", async () => {
      container.innerHTML = createScrollArea()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="scroll-area"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--scroll-area")

      expect(controller.rafId).not.toBeNull()

      controller.disconnect()

      expect(controller.rafId).toBeNull()
    })

    test("clears timers on disconnect", async () => {
      container.innerHTML = createScrollArea()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="scroll-area"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--scroll-area")

      // Add a timer to the map
      controller.hideTimers.set("test", setTimeout(() => {}, 1000))

      controller.disconnect()

      expect(controller.hideTimers.size).toBe(0)
    })
  })
})
