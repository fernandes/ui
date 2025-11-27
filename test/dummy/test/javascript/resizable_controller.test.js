import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import ResizableController from "../../../../app/javascript/ui/controllers/resizable_controller.js"

describe("ResizableController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--resizable", ResizableController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createResizable(options = {}) {
    const {
      direction = "horizontal",
      panelSizes = [50, 50],
      minSizes = [],
      maxSizes = []
    } = options

    const panelsHtml = panelSizes.map((size, index) => {
      const minAttr = minSizes[index] ? `data-min-size="${minSizes[index]}"` : ""
      const maxAttr = maxSizes[index] ? `data-max-size="${maxSizes[index]}"` : ""
      return `
        <div data-ui--resizable-target="panel"
             data-default-size="${size}"
             ${minAttr}
             ${maxAttr}
             data-testid="panel-${index}">
          Panel ${index + 1}
        </div>
      `
    }).join("")

    const handlesHtml = panelSizes.slice(0, -1).map((_, index) => `
      <div data-ui--resizable-target="handle"
           data-action="pointerdown->ui--resizable#startDrag mouseenter->ui--resizable#handleEnter mouseleave->ui--resizable#handleLeave focus->ui--resizable#handleFocus blur->ui--resizable#handleBlur"
           data-testid="handle-${index}">
      </div>
    `).join("")

    return `
      <div data-controller="ui--resizable"
           data-ui--resizable-direction-value="${direction}"
           data-testid="resizable"
           style="width: 400px; height: 300px; display: flex;">
        ${panelSizes.map((size, index) => {
          const minAttr = minSizes[index] ? `data-min-size="${minSizes[index]}"` : ""
          const maxAttr = maxSizes[index] ? `data-max-size="${maxSizes[index]}"` : ""
          const handleHtml = index < panelSizes.length - 1 ? `
            <div data-ui--resizable-target="handle"
                 data-action="pointerdown->ui--resizable#startDrag mouseenter->ui--resizable#handleEnter mouseleave->ui--resizable#handleLeave focus->ui--resizable#handleFocus blur->ui--resizable#handleBlur"
                 data-testid="handle-${index}"
                 style="width: 4px; cursor: col-resize;">
            </div>
          ` : ""
          return `
            <div data-ui--resizable-target="panel"
                 data-default-size="${size}"
                 ${minAttr}
                 ${maxAttr}
                 data-testid="panel-${index}">
              Panel ${index + 1}
            </div>
            ${handleHtml}
          `
        }).join("")}
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      expect(controller).not.toBeNull()
      expect(controller.directionValue).toBe("horizontal")
    })

    test("respects direction value", async () => {
      container.innerHTML = createResizable({ direction: "vertical" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      expect(controller.directionValue).toBe("vertical")
    })

    test("has panel targets", async () => {
      container.innerHTML = createResizable({ panelSizes: [30, 40, 30] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      expect(controller.panelTargets.length).toBe(3)
    })

    test("has handle targets", async () => {
      container.innerHTML = createResizable({ panelSizes: [30, 40, 30] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      expect(controller.handleTargets.length).toBe(2)
    })

    test("sets data-panel-group-direction attribute", async () => {
      container.innerHTML = createResizable({ direction: "horizontal" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')

      expect(element.getAttribute("data-panel-group-direction")).toBe("horizontal")
    })

    test("initializes panel sizes from data attributes", async () => {
      container.innerHTML = createResizable({ panelSizes: [30, 70] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      expect(controller.getCurrentSizes()).toEqual([30, 70])
    })
  })

  describe("Handle ARIA Attributes", () => {
    test("handles have tabindex", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const handle = container.querySelector('[data-testid="handle-0"]')

      expect(handle.getAttribute("tabindex")).toBe("0")
    })

    test("handles have role separator", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const handle = container.querySelector('[data-testid="handle-0"]')

      expect(handle.getAttribute("role")).toBe("separator")
    })

    test("handles have aria-valuenow", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const handle = container.querySelector('[data-testid="handle-0"]')

      expect(handle.getAttribute("aria-valuenow")).toBe("50")
    })

    test("handles have aria-valuemin", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const handle = container.querySelector('[data-testid="handle-0"]')

      expect(handle.getAttribute("aria-valuemin")).toBe("0")
    })

    test("handles have aria-valuemax", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const handle = container.querySelector('[data-testid="handle-0"]')

      expect(handle.getAttribute("aria-valuemax")).toBe("100")
    })

    test("handles have initial inactive state", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const handle = container.querySelector('[data-testid="handle-0"]')

      expect(handle.getAttribute("data-resize-handle-state")).toBe("inactive")
    })
  })

  describe("Keyboard Navigation", () => {
    test("ArrowRight increases left panel size (horizontal)", async () => {
      container.innerHTML = createResizable({ direction: "horizontal", panelSizes: [50, 50] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      const mockEvent = {
        key: "ArrowRight",
        preventDefault: () => {}
      }
      controller.handleKeyDown.call(controller, 0, mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.getCurrentSizes()[0]).toBe(60)
      expect(controller.getCurrentSizes()[1]).toBe(40)
    })

    test("ArrowLeft decreases left panel size (horizontal)", async () => {
      container.innerHTML = createResizable({ direction: "horizontal", panelSizes: [50, 50] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      const mockEvent = {
        key: "ArrowLeft",
        preventDefault: () => {}
      }
      controller.handleKeyDown.call(controller, 0, mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.getCurrentSizes()[0]).toBe(40)
      expect(controller.getCurrentSizes()[1]).toBe(60)
    })

    test("ArrowDown increases left panel size (vertical)", async () => {
      container.innerHTML = createResizable({ direction: "vertical", panelSizes: [50, 50] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      const mockEvent = {
        key: "ArrowDown",
        preventDefault: () => {}
      }
      controller.handleKeyDown.call(controller, 0, mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.getCurrentSizes()[0]).toBe(60)
      expect(controller.getCurrentSizes()[1]).toBe(40)
    })

    test("ArrowUp decreases left panel size (vertical)", async () => {
      container.innerHTML = createResizable({ direction: "vertical", panelSizes: [50, 50] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      const mockEvent = {
        key: "ArrowUp",
        preventDefault: () => {}
      }
      controller.handleKeyDown.call(controller, 0, mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.getCurrentSizes()[0]).toBe(40)
      expect(controller.getCurrentSizes()[1]).toBe(60)
    })

    test("Home minimizes left panel", async () => {
      container.innerHTML = createResizable({ panelSizes: [50, 50], minSizes: [10, 10] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      const mockEvent = {
        key: "Home",
        preventDefault: () => {}
      }
      controller.handleKeyDown.call(controller, 0, mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.getCurrentSizes()[0]).toBe(10)
      expect(controller.getCurrentSizes()[1]).toBe(90)
    })

    test("End maximizes left panel", async () => {
      container.innerHTML = createResizable({ panelSizes: [50, 50], maxSizes: [80, 100] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      const mockEvent = {
        key: "End",
        preventDefault: () => {}
      }
      controller.handleKeyDown.call(controller, 0, mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.getCurrentSizes()[0]).toBe(80)
      expect(controller.getCurrentSizes()[1]).toBe(20)
    })
  })

  describe("Min/Max Constraints", () => {
    test("applies minimum size constraint", async () => {
      container.innerHTML = createResizable({ panelSizes: [50, 50], minSizes: [30, 30] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      // The Home key sets left panel to its minimum
      const mockEvent = {
        key: "Home",
        preventDefault: () => {}
      }
      controller.handleKeyDown.call(controller, 0, mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Home should set to min size
      expect(controller.getCurrentSizes()[0]).toBe(30)
    })

    test("applies maximum size constraint", async () => {
      container.innerHTML = createResizable({ panelSizes: [50, 50], maxSizes: [70, 100] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      // The End key sets left panel to its maximum
      const mockEvent = {
        key: "End",
        preventDefault: () => {}
      }
      controller.handleKeyDown.call(controller, 0, mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      // End should set to max size
      expect(controller.getCurrentSizes()[0]).toBe(70)
    })
  })

  describe("getCurrentSizes", () => {
    test("returns array of panel sizes", async () => {
      container.innerHTML = createResizable({ panelSizes: [30, 40, 30] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      const sizes = controller.getCurrentSizes()

      expect(sizes).toBeInstanceOf(Array)
      expect(sizes.length).toBe(3)
      expect(sizes).toEqual([30, 40, 30])
    })
  })

  describe("setSizes", () => {
    test("programmatically sets panel sizes", async () => {
      container.innerHTML = createResizable({ panelSizes: [50, 50] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      controller.setSizes([30, 70])
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.getCurrentSizes()).toEqual([30, 70])
    })

    test("setSizes dispatches resize event", async () => {
      container.innerHTML = createResizable({ panelSizes: [50, 50] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      let eventFired = false
      let eventSizes = null
      element.addEventListener("ui--resizable:resize", (e) => {
        eventFired = true
        eventSizes = e.detail.sizes
      })

      controller.setSizes([25, 75])
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
      expect(eventSizes).toEqual([25, 75])
    })

    test("setSizes warns if sizes count doesn't match panels", async () => {
      container.innerHTML = createResizable({ panelSizes: [50, 50] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      // Store original console.warn
      const originalWarn = console.warn
      let warnCalled = false
      console.warn = () => { warnCalled = true }

      controller.setSizes([30, 40, 30]) // 3 sizes for 2 panels

      // Restore console.warn
      console.warn = originalWarn

      expect(warnCalled).toBe(true)
    })
  })

  describe("Dragging State", () => {
    test("starts with isDragging false", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      expect(controller.isDragging).toBe(false)
    })

    test("starts with activeHandleIndex -1", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      expect(controller.activeHandleIndex).toBe(-1)
    })
  })

  describe("Handle Hover State", () => {
    test("handleEnter sets hover state", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")
      const handle = container.querySelector('[data-testid="handle-0"]')

      controller.handleEnter({ currentTarget: handle })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(handle.getAttribute("data-resize-handle-state")).toBe("hover")
    })

    test("handleLeave sets inactive state", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")
      const handle = container.querySelector('[data-testid="handle-0"]')

      controller.handleEnter({ currentTarget: handle })
      controller.handleLeave({ currentTarget: handle })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(handle.getAttribute("data-resize-handle-state")).toBe("inactive")
    })
  })

  describe("Handle Focus/Blur", () => {
    test("handleFocus sets hover state", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")
      const handle = container.querySelector('[data-testid="handle-0"]')

      controller.handleFocus({ currentTarget: handle })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(handle.getAttribute("data-resize-handle-state")).toBe("hover")
    })

    test("handleBlur sets inactive state", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")
      const handle = container.querySelector('[data-testid="handle-0"]')

      controller.handleFocus({ currentTarget: handle })
      controller.handleBlur({ currentTarget: handle })
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(handle.getAttribute("data-resize-handle-state")).toBe("inactive")
    })
  })

  describe("Events", () => {
    test("dispatches resize event on keyboard navigation", async () => {
      container.innerHTML = createResizable({ panelSizes: [50, 50] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      let eventFired = false
      let eventDetail = null
      element.addEventListener("ui--resizable:resize", (e) => {
        eventFired = true
        eventDetail = e.detail
      })

      const mockEvent = {
        key: "ArrowRight",
        preventDefault: () => {}
      }
      controller.handleKeyDown.call(controller, 0, mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
      expect(eventDetail.handleIndex).toBe(0)
      expect(eventDetail.sizes).toBeDefined()
    })
  })

  describe("Disconnect", () => {
    test("cleans up on disconnect", async () => {
      container.innerHTML = createResizable()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="resizable"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--resizable")

      // Should not throw
      controller.disconnect()
    })
  })
})
