import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import SliderController from "../../../../app/javascript/ui/controllers/slider_controller.js"

describe("SliderController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--slider", SliderController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createSlider(options = {}) {
    const {
      min = 0,
      max = 100,
      step = 1,
      value = [50],
      orientation = "horizontal",
      disabled = false
    } = options

    const valueJson = JSON.stringify(value)

    return `
      <div data-controller="ui--slider"
           data-ui--slider-min-value="${min}"
           data-ui--slider-max-value="${max}"
           data-ui--slider-step-value="${step}"
           data-ui--slider-value-value='${valueJson}'
           data-ui--slider-orientation-value="${orientation}"
           data-ui--slider-disabled-value="${disabled}"
           data-orientation="${orientation}"
           data-testid="slider"
           style="position: relative; width: 200px; height: 20px;">
        <div data-ui--slider-target="track"
             data-action="click->ui--slider#clickTrack"
             data-testid="track"
             style="position: absolute; width: 100%; height: 4px; background: #ddd;">
          <div data-ui--slider-target="range"
               data-testid="range"
               style="position: absolute; height: 100%; background: #333;"></div>
        </div>
        ${value.map((v, i) => `
          <div data-ui--slider-target="thumb"
               data-action="pointerdown->ui--slider#startDrag"
               data-testid="thumb-${i}"
               tabindex="0"
               role="slider"
               style="position: absolute; width: 16px; height: 16px; background: #333; border-radius: 50%;">
          </div>
        `).join("")}
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createSlider()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")

      expect(controller).not.toBeNull()
      expect(controller.minValue).toBe(0)
      expect(controller.maxValue).toBe(100)
      expect(controller.stepValue).toBe(1)
    })

    test("respects initial value", async () => {
      container.innerHTML = createSlider({ value: [75] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")

      expect(controller.valueValue).toEqual([75])
    })

    test("has track target", async () => {
      container.innerHTML = createSlider()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")

      expect(controller.hasTrackTarget).toBe(true)
    })

    test("has thumb targets", async () => {
      container.innerHTML = createSlider({ value: [25, 75] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")

      expect(controller.thumbTargets.length).toBe(2)
    })
  })

  describe("UI Updates", () => {
    test("updates thumb ARIA attributes", async () => {
      container.innerHTML = createSlider({ value: [50], min: 0, max: 100 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const thumb = container.querySelector('[data-testid="thumb-0"]')

      expect(thumb.getAttribute("aria-valuenow")).toBe("50")
      expect(thumb.getAttribute("aria-valuemin")).toBe("0")
      expect(thumb.getAttribute("aria-valuemax")).toBe("100")
    })

    test("sets orientation attribute on thumb", async () => {
      container.innerHTML = createSlider({ orientation: "horizontal" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const thumb = container.querySelector('[data-testid="thumb-0"]')

      expect(thumb.getAttribute("aria-orientation")).toBe("horizontal")
    })

    test("sets disabled attribute when disabled", async () => {
      container.innerHTML = createSlider({ disabled: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const thumb = container.querySelector('[data-testid="thumb-0"]')

      expect(thumb.getAttribute("aria-disabled")).toBe("true")
    })
  })

  describe("Keyboard Navigation", () => {
    test("ArrowRight increases value", async () => {
      container.innerHTML = createSlider({ value: [50], step: 1 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")
      const thumb = container.querySelector('[data-testid="thumb-0"]')

      const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      thumb.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.valueValue[0]).toBe(51)
    })

    test("ArrowLeft decreases value", async () => {
      container.innerHTML = createSlider({ value: [50], step: 1 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")
      const thumb = container.querySelector('[data-testid="thumb-0"]')

      const event = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
      thumb.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.valueValue[0]).toBe(49)
    })

    test("Home sets to minimum value", async () => {
      container.innerHTML = createSlider({ value: [50], min: 0 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")
      const thumb = container.querySelector('[data-testid="thumb-0"]')

      const event = new KeyboardEvent("keydown", { key: "Home", bubbles: true })
      thumb.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.valueValue[0]).toBe(0)
    })

    test("End sets to maximum value", async () => {
      container.innerHTML = createSlider({ value: [50], max: 100 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")
      const thumb = container.querySelector('[data-testid="thumb-0"]')

      const event = new KeyboardEvent("keydown", { key: "End", bubbles: true })
      thumb.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.valueValue[0]).toBe(100)
    })

    test("does not change value when disabled", async () => {
      container.innerHTML = createSlider({ value: [50], disabled: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")
      const thumb = container.querySelector('[data-testid="thumb-0"]')

      const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      thumb.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.valueValue[0]).toBe(50)
    })

    test("clamps value to min/max", async () => {
      container.innerHTML = createSlider({ value: [100], min: 0, max: 100 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")
      const thumb = container.querySelector('[data-testid="thumb-0"]')

      const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      thumb.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.valueValue[0]).toBe(100) // Stays at max
    })
  })

  describe("Events", () => {
    test("dispatches slider:change on value change", async () => {
      container.innerHTML = createSlider({ value: [50] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")
      const thumb = container.querySelector('[data-testid="thumb-0"]')

      let changeEventFired = false
      let eventDetail = null
      element.addEventListener("slider:change", (e) => {
        changeEventFired = true
        eventDetail = e.detail
      })

      const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      thumb.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(changeEventFired).toBe(true)
      expect(eventDetail.value).toEqual([51])
    })

    test("dispatches slider:commit on keyboard navigation", async () => {
      container.innerHTML = createSlider({ value: [50] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const thumb = container.querySelector('[data-testid="thumb-0"]')

      let commitEventFired = false
      element.addEventListener("slider:commit", () => {
        commitEventFired = true
      })

      const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      thumb.dispatchEvent(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(commitEventFired).toBe(true)
    })
  })

  describe("Multiple Thumbs", () => {
    test("supports multiple values", async () => {
      container.innerHTML = createSlider({ value: [25, 75] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")

      expect(controller.valueValue).toEqual([25, 75])
    })

    test("each thumb has correct ARIA value", async () => {
      container.innerHTML = createSlider({ value: [25, 75] })
      await new Promise(resolve => setTimeout(resolve, 10))

      const thumb0 = container.querySelector('[data-testid="thumb-0"]')
      const thumb1 = container.querySelector('[data-testid="thumb-1"]')

      expect(thumb0.getAttribute("aria-valuenow")).toBe("25")
      expect(thumb1.getAttribute("aria-valuenow")).toBe("75")
    })
  })

  describe("Orientation", () => {
    test("supports horizontal orientation", async () => {
      container.innerHTML = createSlider({ orientation: "horizontal" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")

      expect(controller.orientationValue).toBe("horizontal")
    })

    test("supports vertical orientation", async () => {
      container.innerHTML = createSlider({ orientation: "vertical" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")

      expect(controller.orientationValue).toBe("vertical")
    })
  })

  describe("Disabled State", () => {
    test("startDrag is blocked when disabled", async () => {
      container.innerHTML = createSlider({ value: [50], disabled: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")

      const event = {
        preventDefault: () => {},
        currentTarget: container.querySelector('[data-testid="thumb-0"]'),
        pointerId: 1
      }

      controller.startDrag(event)

      expect(controller.isDragging).toBe(false)
    })

    test("clickTrack is blocked when disabled", async () => {
      container.innerHTML = createSlider({ value: [50], disabled: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="slider"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--slider")
      const initialValue = controller.valueValue[0]

      const event = {
        preventDefault: () => {},
        target: container.querySelector('[data-testid="track"]'),
        clientX: 50,
        clientY: 10
      }

      controller.clickTrack(event)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.valueValue[0]).toBe(initialValue)
    })
  })
})
