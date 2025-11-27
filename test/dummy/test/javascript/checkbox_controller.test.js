import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import CheckboxController from "../../../../app/javascript/ui/controllers/checkbox_controller.js"

describe("CheckboxController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--checkbox", CheckboxController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  function createCheckbox(options = {}) {
    const { checked = false } = options

    return `
      <input type="checkbox"
             data-controller="ui--checkbox"
             ${checked ? 'checked' : ''}
             data-testid="checkbox" />
    `
  }

  describe("Initialization", () => {
    test("connects successfully", async () => {
      container.innerHTML = createCheckbox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const checkbox = container.querySelector('[data-testid="checkbox"]')
      const controller = application.getControllerForElementAndIdentifier(checkbox, "ui--checkbox")

      expect(controller).not.toBeNull()
    })

    test("sets data-state=unchecked when not checked", async () => {
      container.innerHTML = createCheckbox({ checked: false })
      await new Promise(resolve => setTimeout(resolve, 10))

      const checkbox = container.querySelector('[data-testid="checkbox"]')
      expect(checkbox.dataset.state).toBe("unchecked")
      expect(checkbox.getAttribute("aria-checked")).toBe("false")
    })

    test("sets data-state=checked when checked", async () => {
      container.innerHTML = createCheckbox({ checked: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const checkbox = container.querySelector('[data-testid="checkbox"]')
      expect(checkbox.dataset.state).toBe("checked")
      expect(checkbox.getAttribute("aria-checked")).toBe("true")
    })
  })

  describe("Change handling", () => {
    test("updates state when checked", async () => {
      container.innerHTML = createCheckbox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const checkbox = container.querySelector('[data-testid="checkbox"]')
      checkbox.checked = true
      checkbox.dispatchEvent(new Event("change", { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(checkbox.dataset.state).toBe("checked")
      expect(checkbox.getAttribute("aria-checked")).toBe("true")
    })

    test("updates state when unchecked", async () => {
      container.innerHTML = createCheckbox({ checked: true })
      await new Promise(resolve => setTimeout(resolve, 10))

      const checkbox = container.querySelector('[data-testid="checkbox"]')
      checkbox.checked = false
      checkbox.dispatchEvent(new Event("change", { bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(checkbox.dataset.state).toBe("unchecked")
      expect(checkbox.getAttribute("aria-checked")).toBe("false")
    })
  })

  describe("Disconnect", () => {
    test("removes event listener on disconnect", async () => {
      container.innerHTML = createCheckbox()
      await new Promise(resolve => setTimeout(resolve, 10))

      const checkbox = container.querySelector('[data-testid="checkbox"]')
      const controller = application.getControllerForElementAndIdentifier(checkbox, "ui--checkbox")

      controller.disconnect()
      await new Promise(resolve => setTimeout(resolve, 10))

      // Should not throw
      checkbox.checked = true
      checkbox.dispatchEvent(new Event("change", { bubbles: true }))
    })
  })
})
