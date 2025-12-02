import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { Application } from "@hotwired/stimulus"
import DatepickerController from "../../../../app/javascript/ui/controllers/datepicker_controller"
import PopoverController from "../../../../app/javascript/ui/controllers/popover_controller"
import CalendarController from "../../../../app/javascript/ui/controllers/calendar_controller"

describe("DatepickerController", () => {
  let application

  // Helper to create a minimal datepicker with popover and calendar
  const createDatepicker = (options = {}) => {
    const {
      mode = "single",
      selected = [],
      placeholder = "Select date",
      closeOnSelect = true,
      locale = "en-US",
      format = "long"
    } = options

    const selectedJson = JSON.stringify(selected)

    const html = `
      <div
        data-controller="ui--datepicker"
        data-ui--datepicker-mode-value="${mode}"
        data-ui--datepicker-selected-value='${selectedJson}'
        data-ui--datepicker-placeholder-value="${placeholder}"
        data-ui--datepicker-close-on-select-value="${closeOnSelect}"
        data-ui--datepicker-locale-value="${locale}"
        data-ui--datepicker-format-value="${format}"
      >
        <button
          type="button"
          data-ui--datepicker-target="trigger"
          data-ui--popover-target="trigger"
        >
          <span data-ui--datepicker-target="label">${placeholder}</span>
        </button>

        <div
          data-controller="ui--popover"
          data-ui--popover-trigger-value="manual"
        >
          <div data-ui--popover-target="content" data-state="closed" style="position: absolute;">
            <div
              data-controller="ui--calendar"
              data-ui--calendar-mode-value="${mode}"
              data-action="ui--calendar:select->ui--datepicker#handleSelect"
            >
              <div data-ui--calendar-target="grid"></div>
            </div>
          </div>
        </div>

        <input type="hidden" data-ui--datepicker-target="hiddenInput" value="">
      </div>
    `

    document.body.innerHTML = html
    return document.querySelector("[data-controller='ui--datepicker']")
  }

  // Helper to create datepicker with input mode
  const createInputDatepicker = () => {
    const html = `
      <div
        data-controller="ui--datepicker"
        data-ui--datepicker-mode-value="single"
        data-ui--datepicker-placeholder-value="Select date"
        data-ui--datepicker-close-on-select-value="true"
      >
        <div
          data-controller="ui--popover"
          data-ui--popover-trigger-value="manual"
        >
          <div class="relative">
            <input
              type="text"
              placeholder="June 01, 2025"
              data-ui--datepicker-target="input"
              data-action="input->ui--datepicker#handleInput keydown->ui--datepicker#handleInputKeydown"
            >
            <button
              type="button"
              data-ui--datepicker-target="trigger"
              data-ui--popover-target="trigger"
            >
              Calendar Icon
            </button>
          </div>

          <div data-ui--popover-target="content" data-state="closed" style="position: absolute;">
            <div
              data-controller="ui--calendar"
              data-ui--calendar-mode-value="single"
              data-action="ui--calendar:select->ui--datepicker#handleSelect"
            >
              <div data-ui--calendar-target="grid"></div>
            </div>
          </div>
        </div>

        <input type="hidden" data-ui--datepicker-target="hiddenInput" value="">
      </div>
    `

    document.body.innerHTML = html
    return document.querySelector("[data-controller='ui--datepicker']")
  }

  beforeEach(() => {
    application = Application.start()
    application.register("ui--datepicker", DatepickerController)
    application.register("ui--popover", PopoverController)
    application.register("ui--calendar", CalendarController)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  describe("initialization", () => {
    it("connects successfully", async () => {
      const element = createDatepicker()
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      expect(controller).toBeDefined()
    })

    it("displays placeholder when no date selected", async () => {
      const element = createDatepicker({ placeholder: "Pick a date" })
      await new Promise(r => setTimeout(r, 0))

      const label = element.querySelector("[data-ui--datepicker-target='label']")
      expect(label.textContent).toBe("Pick a date")
    })

    it("displays selected date on connect", async () => {
      const element = createDatepicker({ selected: ["2025-06-15"] })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      const formatted = controller.getFormattedDate()

      // Using regex for locale flexibility
      expect(formatted).toMatch(/Jun|6/)
      expect(formatted).toMatch(/15/)
      expect(formatted).toMatch(/2025/)
    })
  })

  describe("handleSelect", () => {
    it("updates label with formatted date on single selection", async () => {
      const element = createDatepicker()
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      const label = element.querySelector("[data-ui--datepicker-target='label']")

      // Simulate calendar select event
      const event = new CustomEvent("ui--calendar:select", {
        bubbles: true,
        detail: { selected: ["2025-07-20"], date: "2025-07-20" }
      })
      controller.handleSelect(event)

      // Using regex for locale flexibility
      expect(label.textContent).toMatch(/Jul|7/)
      expect(label.textContent).toMatch(/20/)
      expect(label.textContent).toMatch(/2025/)
    })

    it("updates hidden input with selected date", async () => {
      const element = createDatepicker()
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      const hiddenInput = element.querySelector("[data-ui--datepicker-target='hiddenInput']")

      // Simulate calendar select event
      const event = new CustomEvent("ui--calendar:select", {
        bubbles: true,
        detail: { selected: ["2025-07-20"], date: "2025-07-20" }
      })
      controller.handleSelect(event)

      expect(hiddenInput.value).toBe("2025-07-20")
    })

    it("dispatches select event with formatted date", async () => {
      const element = createDatepicker()
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")

      const selectHandler = vi.fn()
      element.addEventListener("ui--datepicker:select", selectHandler)

      // Simulate calendar select event
      const event = new CustomEvent("ui--calendar:select", {
        bubbles: true,
        detail: { selected: ["2025-07-20"], date: "2025-07-20" }
      })
      controller.handleSelect(event)

      expect(selectHandler).toHaveBeenCalled()
      const detail = selectHandler.mock.calls[0][0].detail
      expect(detail.selected).toEqual(["2025-07-20"])
      expect(detail.date).toBe("2025-07-20")
      expect(detail.formatted).toMatch(/Jul|7/)
    })
  })

  describe("range mode", () => {
    it("displays placeholder for range mode", async () => {
      const element = createDatepicker({
        mode: "range",
        placeholder: "Select dates"
      })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      // Range mode uses rangePlaceholder by default
      expect(controller.getFormattedDate()).toBe("Select date range")
    })

    it("displays partial range when one date selected", async () => {
      const element = createDatepicker({ mode: "range", selected: ["2025-07-15"] })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      const formatted = controller.getFormattedDate()

      // Using regex for locale flexibility
      expect(formatted).toMatch(/Jul|7/)
      expect(formatted).toMatch(/15/)
      expect(formatted).toContain("...")
    })

    it("displays full range when two dates selected", async () => {
      const element = createDatepicker({
        mode: "range",
        selected: ["2025-07-15", "2025-07-20"]
      })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      const formatted = controller.getFormattedDate()

      // The format contains start date, separator, and end date
      // Using regex to be more flexible with locale variations
      expect(formatted).toMatch(/15/)
      expect(formatted).toMatch(/20/)
      expect(formatted).toMatch(/-/)
      // Should contain month in some form (July, Jul, 7, etc)
      expect(formatted).toMatch(/Jul|7/)
    })

    it("does not close popover on first selection in range mode", async () => {
      const element = createDatepicker({ mode: "range" })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")

      expect(controller.shouldClosePopover()).toBe(false)

      // Select first date
      controller.selectedValue = ["2025-07-15"]
      expect(controller.shouldClosePopover()).toBe(false)

      // Select second date
      controller.selectedValue = ["2025-07-15", "2025-07-20"]
      expect(controller.shouldClosePopover()).toBe(true)
    })
  })

  describe("multiple mode", () => {
    it("displays count when multiple dates selected", async () => {
      const element = createDatepicker({
        mode: "multiple",
        selected: ["2025-07-15", "2025-07-18", "2025-07-22"]
      })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      const formatted = controller.getFormattedDate()

      expect(formatted).toBe("3 dates selected")
    })

    it("never closes popover in multiple mode", async () => {
      const element = createDatepicker({ mode: "multiple" })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")

      controller.selectedValue = ["2025-07-15"]
      expect(controller.shouldClosePopover()).toBe(false)

      controller.selectedValue = ["2025-07-15", "2025-07-20"]
      expect(controller.shouldClosePopover()).toBe(false)

      controller.selectedValue = ["2025-07-15", "2025-07-20", "2025-07-25"]
      expect(controller.shouldClosePopover()).toBe(false)
    })
  })

  describe("input mode", () => {
    it("connects with input target", async () => {
      const element = createInputDatepicker()
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      expect(controller.hasInputTarget).toBe(true)
    })

    it("updates input value on date selection", async () => {
      const element = createInputDatepicker()
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      const input = element.querySelector("[data-ui--datepicker-target='input']")

      // Simulate calendar select event
      const event = new CustomEvent("ui--calendar:select", {
        bubbles: true,
        detail: { selected: ["2025-06-01"], date: "2025-06-01" }
      })
      controller.handleSelect(event)

      // Using regex for locale flexibility
      expect(input.value).toMatch(/Jun|6/)
      expect(input.value).toMatch(/1/)
      expect(input.value).toMatch(/2025/)
    })

    it("parses date from input", async () => {
      const element = createInputDatepicker()
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")

      // Test various date formats
      expect(controller.parseInputDate("2025-06-15")).toBeTruthy()
      expect(controller.parseInputDate("June 15, 2025")).toBeTruthy()
      expect(controller.parseInputDate("invalid")).toBeFalsy()
    })

    it("handles ArrowDown to open popover", async () => {
      const element = createInputDatepicker()
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      const openSpy = vi.spyOn(controller, "openPopover")

      const event = new KeyboardEvent("keydown", { key: "ArrowDown" })
      controller.handleInputKeydown(event)

      expect(openSpy).toHaveBeenCalled()
    })
  })

  describe("date formatting", () => {
    it("formats dates according to locale", async () => {
      const element = createDatepicker({
        selected: ["2025-12-25"],
        locale: "en-US"
      })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")
      const formatted = controller.formatSingleDate("2025-12-25")

      // Using regex for locale flexibility
      expect(formatted).toMatch(/Dec|12/)
      expect(formatted).toMatch(/25/)
      expect(formatted).toMatch(/2025/)
    })

    it("formats dates with different format styles", async () => {
      const shortElement = createDatepicker({
        selected: ["2025-12-25"],
        format: "short"
      })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(shortElement, "ui--datepicker")

      // Short format should be more compact
      const formatted = controller.formatSingleDate("2025-12-25")
      expect(formatted.length).toBeLessThan(20)
    })

    it("returns placeholder for invalid dates", async () => {
      const element = createDatepicker({ placeholder: "Pick a date" })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")

      expect(controller.formatSingleDate(null)).toBe("Pick a date")
      expect(controller.formatSingleDate("invalid")).toBe("Pick a date")
    })
  })

  describe("closeOnSelect", () => {
    it("closes popover by default on single selection", async () => {
      const element = createDatepicker({ closeOnSelect: true })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")

      controller.selectedValue = ["2025-07-15"]
      expect(controller.shouldClosePopover()).toBe(true)
    })

    it("does not close popover when closeOnSelect is false", async () => {
      const element = createDatepicker({ closeOnSelect: false })
      await new Promise(r => setTimeout(r, 0))

      const controller = application.getControllerForElementAndIdentifier(element, "ui--datepicker")

      controller.selectedValue = ["2025-07-15"]
      expect(controller.shouldClosePopover()).toBe(false)
    })
  })
})
