import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import { Application } from "@hotwired/stimulus"
import CalendarController from "../../../../app/javascript/ui/controllers/calendar_controller.js"

describe("CalendarController", () => {
  let application
  let container

  beforeEach(() => {
    application = Application.start()
    application.register("ui--calendar", CalendarController)
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    application.stop()
    document.body.innerHTML = ""
  })

  describe("Initial Rendering", () => {
    test("renders month label with specified month", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-month-value="2024-11-01">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const monthLabel = container.querySelector('[data-ui--calendar-target="monthLabel"]')
      expect(monthLabel.textContent).toBe("November 2024")
    })

    test("renders date grid with day buttons", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-month-value="2024-11-01">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const grid = container.querySelector('[data-ui--calendar-target="grid"]')
      const buttons = grid.querySelectorAll('button[data-date]')

      // November 2024 grid should have dates from late October to early December
      expect(buttons.length).toBeGreaterThanOrEqual(28) // At least 28 days
      expect(buttons.length).toBeLessThanOrEqual(42) // At most 6 weeks
    })

    test("renders specific date in grid", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-month-value="2024-11-01">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      expect(nov15).not.toBeNull()
      expect(nov15.textContent).toBe("15")
    })

    test("renders multiple months when numberOfMonths > 1", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-number-of-months-value="2">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const monthLabels = container.querySelectorAll('[data-ui--calendar-target="monthLabel"]')
      expect(monthLabels[0].textContent).toBe("November 2024")
      expect(monthLabels[1].textContent).toBe("December 2024")

      // Both grids should have dates
      const grids = container.querySelectorAll('[data-ui--calendar-target="grid"]')
      expect(grids[0].querySelectorAll('button[data-date]').length).toBeGreaterThan(0)
      expect(grids[1].querySelectorAll('button[data-date]').length).toBeGreaterThan(0)
    })
  })

  describe("Navigation", () => {
    test("previousMonth navigates to previous month", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-month-value="2024-11-01">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      controller.previousMonth()
      await new Promise(resolve => setTimeout(resolve, 10))

      const monthLabel = container.querySelector('[data-ui--calendar-target="monthLabel"]')
      expect(monthLabel.textContent).toBe("October 2024")
    })

    test("nextMonth navigates to next month", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-month-value="2024-11-01">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      controller.nextMonth()
      await new Promise(resolve => setTimeout(resolve, 10))

      const monthLabel = container.querySelector('[data-ui--calendar-target="monthLabel"]')
      expect(monthLabel.textContent).toBe("December 2024")
    })
  })

  describe("Single Selection Mode", () => {
    test("selects a single date on click", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      nov15.click()

      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedValue).toEqual(["2024-11-15"])
    })

    test("replaces previous selection when clicking new date", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-selected-value='["2024-11-10"]'>
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      const nov20 = container.querySelector('[data-date="2024-11-20"]')
      nov20.click()

      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedValue).toEqual(["2024-11-20"])
    })

    test("updates hidden input with selected date", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01">
          <input type="hidden" data-ui--calendar-target="input">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      nov15.click()

      await new Promise(resolve => setTimeout(resolve, 10))

      const input = container.querySelector('[data-ui--calendar-target="input"]')
      expect(input.value).toBe("2024-11-15")
    })

    test("selected date has aria-selected=true", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      nov15.click()

      await new Promise(resolve => setTimeout(resolve, 10))

      const selectedButton = container.querySelector('[data-date="2024-11-15"]')
      expect(selectedButton.getAttribute("aria-selected")).toBe("true")
    })
  })

  describe("Range Selection Mode", () => {
    test("first click sets range start", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="range"
             data-ui--calendar-month-value="2024-11-01">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      const nov10 = container.querySelector('[data-date="2024-11-10"]')
      nov10.click()

      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedValue).toEqual(["2024-11-10"])
    })

    test("second click sets range end", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="range"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-selected-value='["2024-11-10"]'>
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      const nov20 = container.querySelector('[data-date="2024-11-20"]')
      nov20.click()

      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedValue).toEqual(["2024-11-10", "2024-11-20"])
    })

    test("third click resets range", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="range"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-selected-value='["2024-11-10", "2024-11-20"]'>
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      const nov25 = container.querySelector('[data-date="2024-11-25"]')
      nov25.click()

      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedValue).toEqual(["2024-11-25"])
    })

    test("swaps start/end if end is before start", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="range"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-selected-value='["2024-11-20"]'>
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      // Click a date before the start
      const nov10 = container.querySelector('[data-date="2024-11-10"]')
      nov10.click()

      await new Promise(resolve => setTimeout(resolve, 10))

      // Should swap so start is before end
      expect(controller.selectedValue).toEqual(["2024-11-10", "2024-11-20"])
    })
  })

  describe("Multiple Selection Mode", () => {
    test("adds date to selection on click", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="multiple"
             data-ui--calendar-month-value="2024-11-01">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      const nov10 = container.querySelector('[data-date="2024-11-10"]')
      nov10.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      nov15.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedValue).toContain("2024-11-10")
      expect(controller.selectedValue).toContain("2024-11-15")
      expect(controller.selectedValue.length).toBe(2)
    })

    test("removes date from selection on second click", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="multiple"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-selected-value='["2024-11-10", "2024-11-15"]'>
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      // Click nov10 again to remove it
      const nov10 = container.querySelector('[data-date="2024-11-10"]')
      nov10.click()
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedValue).toEqual(["2024-11-15"])
    })
  })

  describe("Keyboard Navigation", () => {
    test("ArrowRight moves focus to next day", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-action="keydown->ui--calendar#handleKeydown">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')

      // Focus on Nov 15
      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      nov15.focus()

      // Simulate ArrowRight keydown
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      element.dispatchEvent(event)

      await new Promise(resolve => setTimeout(resolve, 10))

      // Should now focus Nov 16
      const nov16 = container.querySelector('[data-date="2024-11-16"]')
      expect(document.activeElement).toBe(nov16)
    })

    test("ArrowLeft moves focus to previous day", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-action="keydown->ui--calendar#handleKeydown">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')

      // Focus on Nov 15
      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      nov15.focus()

      // Simulate ArrowLeft keydown
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
      element.dispatchEvent(event)

      await new Promise(resolve => setTimeout(resolve, 10))

      // Should now focus Nov 14
      const nov14 = container.querySelector('[data-date="2024-11-14"]')
      expect(document.activeElement).toBe(nov14)
    })

    test("ArrowDown moves focus to next week", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-action="keydown->ui--calendar#handleKeydown">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')

      // Focus on Nov 15
      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      nov15.focus()

      // Simulate ArrowDown keydown
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
      element.dispatchEvent(event)

      await new Promise(resolve => setTimeout(resolve, 10))

      // Should now focus Nov 22 (7 days later)
      const nov22 = container.querySelector('[data-date="2024-11-22"]')
      expect(document.activeElement).toBe(nov22)
    })

    test("ArrowUp moves focus to previous week", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-action="keydown->ui--calendar#handleKeydown">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')

      // Focus on Nov 15
      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      nov15.focus()

      // Simulate ArrowUp keydown
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
      element.dispatchEvent(event)

      await new Promise(resolve => setTimeout(resolve, 10))

      // Should now focus Nov 8 (7 days earlier)
      const nov8 = container.querySelector('[data-date="2024-11-08"]')
      expect(document.activeElement).toBe(nov8)
    })

    test("Enter selects focused date", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-action="keydown->ui--calendar#handleKeydown">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      // Focus on Nov 15
      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      nov15.focus()

      // Simulate Enter keydown
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      element.dispatchEvent(event)

      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedValue).toEqual(["2024-11-15"])
    })

    test("Space selects focused date", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-action="keydown->ui--calendar#handleKeydown">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      // Focus on Nov 15
      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      nov15.focus()

      // Simulate Space keydown
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true })
      element.dispatchEvent(event)

      await new Promise(resolve => setTimeout(resolve, 10))

      expect(controller.selectedValue).toEqual(["2024-11-15"])
    })
  })

  describe("Date Constraints", () => {
    test("disables dates before minDate", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-min-date-value="2024-11-15">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const nov10 = container.querySelector('[data-date="2024-11-10"]')
      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      const nov20 = container.querySelector('[data-date="2024-11-20"]')

      expect(nov10.disabled).toBe(true)
      expect(nov15.disabled).toBe(false)
      expect(nov20.disabled).toBe(false)
    })

    test("disables dates after maxDate", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-max-date-value="2024-11-15">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const nov10 = container.querySelector('[data-date="2024-11-10"]')
      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      const nov20 = container.querySelector('[data-date="2024-11-20"]')

      expect(nov10.disabled).toBe(false)
      expect(nov15.disabled).toBe(false)
      expect(nov20.disabled).toBe(true)
    })

    test("disables specific dates in disabled array", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-disabled-value='["2024-11-10", "2024-11-15"]'>
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const nov10 = container.querySelector('[data-date="2024-11-10"]')
      const nov12 = container.querySelector('[data-date="2024-11-12"]')
      const nov15 = container.querySelector('[data-date="2024-11-15"]')

      expect(nov10.disabled).toBe(true)
      expect(nov12.disabled).toBe(false)
      expect(nov15.disabled).toBe(true)
    })

    test("prevents selection of disabled dates", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-min-date-value="2024-11-15">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const element = container.querySelector('[data-controller="ui--calendar"]')
      const controller = application.getControllerForElementAndIdentifier(element, "ui--calendar")

      // Try to click disabled date
      const nov10 = container.querySelector('[data-date="2024-11-10"]')
      nov10.click()

      await new Promise(resolve => setTimeout(resolve, 10))

      // Selection should remain empty
      expect(controller.selectedValue).toEqual([])
    })
  })

  describe("Configuration Options", () => {
    test("weekStartsOn changes first day of week", async () => {
      // With weekStartsOn=1, week starts on Monday
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-week-starts-on-value="1">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const grid = container.querySelector('[data-ui--calendar-target="grid"]')
      const firstRow = grid.querySelector('tr')
      const firstButton = firstRow.querySelector('button[data-date]')

      // November 2024 starts on Friday. With week starting Monday,
      // first row should start with Monday Oct 28
      expect(firstButton.dataset.date).toBe("2024-10-28")
    })

    test("showOutsideDays=false hides days from adjacent months", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-show-outside-days-value="false">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      // October dates should not have buttons (empty td)
      const oct31 = container.querySelector('[data-date="2024-10-31"]')
      expect(oct31).toBeNull()

      // November dates should exist
      const nov1 = container.querySelector('[data-date="2024-11-01"]')
      expect(nov1).not.toBeNull()
    })

    test("fixedWeeks=true always shows 6 weeks", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-month-value="2024-02-01"
             data-ui--calendar-fixed-weeks-value="true">
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const grid = container.querySelector('[data-ui--calendar-target="grid"]')
      const rows = grid.querySelectorAll('tr')

      // Should have exactly 6 weeks (rows)
      expect(rows.length).toBe(6)

      // Should have 42 day cells (6 weeks x 7 days)
      const buttons = grid.querySelectorAll('button[data-date]')
      expect(buttons.length).toBe(42)
    })
  })

  describe("Pre-selected Dates", () => {
    test("renders with pre-selected single date", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="single"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-selected-value='["2024-11-15"]'>
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const nov15 = container.querySelector('[data-date="2024-11-15"]')
      expect(nov15.getAttribute("aria-selected")).toBe("true")
    })

    test("renders with pre-selected date range", async () => {
      container.innerHTML = `
        <div data-controller="ui--calendar"
             data-ui--calendar-mode-value="range"
             data-ui--calendar-month-value="2024-11-01"
             data-ui--calendar-selected-value='["2024-11-10", "2024-11-15"]'>
          <div data-ui--calendar-target="monthLabel"></div>
          <table>
            <tbody data-ui--calendar-target="grid"></tbody>
          </table>
        </div>
      `

      await new Promise(resolve => setTimeout(resolve, 10))

      const nov10 = container.querySelector('[data-date="2024-11-10"]')
      const nov15 = container.querySelector('[data-date="2024-11-15"]')

      expect(nov10.getAttribute("aria-selected")).toBe("true")
      expect(nov15.getAttribute("aria-selected")).toBe("true")
    })
  })
})
