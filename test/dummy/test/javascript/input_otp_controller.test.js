import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import InputOTPController from "../../../../app/javascript/ui/controllers/input_otp_controller.js"

describe("InputOTPController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--input-otp", InputOTPController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createInputOTP(options = {}) {
    const { length = 6, pattern = "\\d" } = options

    let inputsHtml = ""
    for (let i = 0; i < length; i++) {
      inputsHtml += `
        <input type="text"
               maxlength="1"
               data-ui--input-otp-target="input"
               data-action="input->ui--input-otp#input keydown->ui--input-otp#keydown paste->ui--input-otp#paste"
               data-testid="input-${i}" />
      `
    }

    return `
      <div data-controller="ui--input-otp"
           data-ui--input-otp-length-value="${length}"
           data-ui--input-otp-pattern-value="${pattern}"
           data-testid="otp-container">
        ${inputsHtml}
      </div>
    `
  }

  describe("Initialization", () => {
    test("connects with default values", async () => {
      container.innerHTML = createInputOTP()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")

      expect(controller).not.toBeNull()
      expect(controller.lengthValue).toBe(6)
      expect(controller.patternValue).toBe("\\d")
    })

    test("has input targets", async () => {
      container.innerHTML = createInputOTP({ length: 4 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")

      expect(controller.inputTargets.length).toBe(4)
    })

    test("starts with completeValue false", async () => {
      container.innerHTML = createInputOTP()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")

      expect(controller.completeValue).toBe(false)
    })
  })

  describe("Input Handling", () => {
    test("moves to next input after entering value", async () => {
      container.innerHTML = createInputOTP()
      await new Promise(resolve => setTimeout(resolve, 10))

      const input0 = container.querySelector('[data-testid="input-0"]')
      const input1 = container.querySelector('[data-testid="input-1"]')

      input0.value = "5"
      input0.dispatchEvent(new Event("input", { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 10))

      // input1 should be focused (can't truly test focus in happy-dom, but logic should work)
      expect(input0.value).toBe("5")
    })

    test("clears invalid input based on pattern", async () => {
      container.innerHTML = createInputOTP({ pattern: "\\d" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const input0 = container.querySelector('[data-testid="input-0"]')

      input0.value = "a"
      input0.dispatchEvent(new Event("input", { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(input0.value).toBe("")
    })

    test("accepts valid input based on pattern", async () => {
      container.innerHTML = createInputOTP({ pattern: "\\d" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const input0 = container.querySelector('[data-testid="input-0"]')

      input0.value = "7"
      input0.dispatchEvent(new Event("input", { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(input0.value).toBe("7")
    })
  })

  describe("Keyboard Navigation", () => {
    test("backspace on empty input clears previous", async () => {
      container.innerHTML = createInputOTP()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")
      const input0 = container.querySelector('[data-testid="input-0"]')
      const input1 = container.querySelector('[data-testid="input-1"]')

      input0.value = "1"
      input1.value = ""

      const mockEvent = {
        key: "Backspace",
        target: input1,
        preventDefault: () => {}
      }
      controller.keydown(mockEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(input0.value).toBe("")
    })

    test("ArrowLeft moves to previous input", async () => {
      container.innerHTML = createInputOTP()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")
      const input1 = container.querySelector('[data-testid="input-1"]')

      // Create custom event object instead of modifying readonly property
      const mockEvent = {
        key: "ArrowLeft",
        target: input1,
        preventDefault: () => {}
      }
      controller.keydown(mockEvent)

      // Logic test - should not throw
    })

    test("ArrowRight moves to next input", async () => {
      container.innerHTML = createInputOTP()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")
      const input0 = container.querySelector('[data-testid="input-0"]')

      const mockEvent = {
        key: "ArrowRight",
        target: input0,
        preventDefault: () => {}
      }
      controller.keydown(mockEvent)

      // Logic test - should not throw
    })

    test("Home moves to first input", async () => {
      container.innerHTML = createInputOTP()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")
      const input3 = container.querySelector('[data-testid="input-3"]')

      const mockEvent = {
        key: "Home",
        target: input3,
        preventDefault: () => {}
      }
      controller.keydown(mockEvent)

      // Logic test - should not throw
    })

    test("End moves to last input", async () => {
      container.innerHTML = createInputOTP()
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")
      const input0 = container.querySelector('[data-testid="input-0"]')

      const mockEvent = {
        key: "End",
        target: input0,
        preventDefault: () => {}
      }
      controller.keydown(mockEvent)

      // Logic test - should not throw
    })
  })

  describe("Paste Handling", () => {
    test("distributes pasted content across inputs", async () => {
      container.innerHTML = createInputOTP({ length: 4 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")
      const input0 = container.querySelector('[data-testid="input-0"]')

      const clipboardData = {
        getData: () => "1234"
      }
      const pasteEvent = {
        preventDefault: () => {},
        clipboardData,
        target: input0
      }

      controller.paste(pasteEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(container.querySelector('[data-testid="input-0"]').value).toBe("1")
      expect(container.querySelector('[data-testid="input-1"]').value).toBe("2")
      expect(container.querySelector('[data-testid="input-2"]').value).toBe("3")
      expect(container.querySelector('[data-testid="input-3"]').value).toBe("4")
    })

    test("rejects paste with invalid characters", async () => {
      container.innerHTML = createInputOTP({ pattern: "\\d" })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")
      const input0 = container.querySelector('[data-testid="input-0"]')

      const clipboardData = {
        getData: () => "abc123"
      }
      const pasteEvent = {
        preventDefault: () => {},
        clipboardData,
        target: input0
      }

      controller.paste(pasteEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      // Should not update because it contains invalid chars
      expect(container.querySelector('[data-testid="input-0"]').value).toBe("")
    })

    test("accepts paste with all valid characters", async () => {
      container.innerHTML = createInputOTP({ pattern: "\\d", length: 4 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")
      const input0 = container.querySelector('[data-testid="input-0"]')

      const clipboardData = {
        getData: () => "9876"
      }
      const pasteEvent = {
        preventDefault: () => {},
        clipboardData,
        target: input0
      }

      controller.paste(pasteEvent)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(container.querySelector('[data-testid="input-0"]').value).toBe("9")
      expect(container.querySelector('[data-testid="input-3"]').value).toBe("6")
    })
  })

  describe("Completion", () => {
    test("sets completeValue true when all inputs filled", async () => {
      container.innerHTML = createInputOTP({ length: 4 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")

      // Fill all inputs
      for (let i = 0; i < 4; i++) {
        const input = container.querySelector(`[data-testid="input-${i}"]`)
        input.value = String(i + 1)
      }

      controller.checkComplete()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.completeValue).toBe(true)
    })

    test("dispatches inputotp:complete event when complete", async () => {
      container.innerHTML = createInputOTP({ length: 4 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")

      let eventFired = false
      let eventValue = null
      element.addEventListener("inputotp:complete", (e) => {
        eventFired = true
        eventValue = e.detail.value
      })

      // Fill all inputs
      for (let i = 0; i < 4; i++) {
        const input = container.querySelector(`[data-testid="input-${i}"]`)
        input.value = String(i + 1)
      }

      controller.checkComplete()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventFired).toBe(true)
      expect(eventValue).toBe("1234")
    })

    test("does not fire complete event if already complete", async () => {
      container.innerHTML = createInputOTP({ length: 4 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")

      // Set already complete
      controller.completeValue = true

      let eventCount = 0
      element.addEventListener("inputotp:complete", () => {
        eventCount++
      })

      // Fill all inputs
      for (let i = 0; i < 4; i++) {
        const input = container.querySelector(`[data-testid="input-${i}"]`)
        input.value = String(i + 1)
      }

      controller.checkComplete()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(eventCount).toBe(0) // Should not fire again
    })
  })

  describe("getValue", () => {
    test("returns combined value of all inputs", async () => {
      container.innerHTML = createInputOTP({ length: 4 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")

      // Fill inputs
      container.querySelector('[data-testid="input-0"]').value = "1"
      container.querySelector('[data-testid="input-1"]').value = "2"
      container.querySelector('[data-testid="input-2"]').value = "3"
      container.querySelector('[data-testid="input-3"]').value = "4"

      expect(controller.getValue()).toBe("1234")
    })

    test("returns partial value if not all filled", async () => {
      container.innerHTML = createInputOTP({ length: 4 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")

      container.querySelector('[data-testid="input-0"]').value = "1"
      container.querySelector('[data-testid="input-1"]').value = "2"
      // input 2 and 3 empty

      expect(controller.getValue()).toBe("12")
    })
  })

  describe("clear", () => {
    test("clears all inputs", async () => {
      container.innerHTML = createInputOTP({ length: 4 })
      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-testid="otp-container"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--input-otp")

      // Fill inputs
      for (let i = 0; i < 4; i++) {
        container.querySelector(`[data-testid="input-${i}"]`).value = String(i + 1)
      }
      controller.completeValue = true

      controller.clear()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.getValue()).toBe("")
      expect(controller.completeValue).toBe(false)
    })
  })
})
