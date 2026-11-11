// Date Picker accessibility, black-box. Markup is what `render "ui/date_picker"`
// + `ui/date_picker/trigger` render (classes, icons and the month/year
// navigation dropped); the Calendar renders its day grid in JS. The calendar
// root carries its own keydown action next to the date picker select action.
import { describe, test, expect, afterEach } from "bun:test"
import { screen } from "@testing-library/dom"
import { render, cleanup, settle } from "./support/render.js"

const pad = (n) => String(n).padStart(2, "0")
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const datePickerMarkup = ({ mode = "single", selected = [], month = iso(new Date()), months = 1 } = {}) => `
  <div data-controller="ui--datepicker" data-ui--datepicker-mode-value="${mode}" data-ui--datepicker-selected-value='${JSON.stringify(selected)}' data-ui--datepicker-locale-value="en-US" data-ui--datepicker-format-value="long" data-ui--datepicker-placeholder-value="Select date" data-ui--datepicker-close-on-select-value="true">
    <div data-controller="ui--popover" data-ui--popover-placement-value="bottom-start" data-ui--popover-offset-value="4" data-ui--popover-trigger-value="click" data-ui--popover-hover-delay-value="0">
      <button type="button" data-ui--datepicker-target="trigger" data-ui--popover-target="trigger">
        <span data-ui--datepicker-target="label">Pick a date</span>
      </button>
      <div data-ui--popover-target="content" data-state="closed">
        <div role="application" aria-label="Date picker" data-controller="ui--calendar" data-ui--calendar-mode-value="${mode}" data-ui--calendar-selected-value='${JSON.stringify(selected)}' data-ui--calendar-month-value="${month}" data-ui--calendar-number-of-months-value="${months}" data-ui--calendar-week-starts-on-value="0" data-ui--calendar-locale-value="en-US" data-ui--calendar-disabled-value="[]" data-ui--calendar-show-outside-days-value="true" data-ui--calendar-fixed-weeks-value="false" data-action="keydown->ui--calendar#handleKeydown ui--calendar:select->ui--datepicker#handleSelect">
          <div aria-live="polite" aria-atomic="true" data-ui--calendar-target="liveRegion"></div>
          <div data-ui--calendar-target="monthLabel"></div>
          ${Array.from({ length: months }, () => `<table role="grid">
            <thead><tr data-ui--calendar-target="weekdaysHeader"><th scope="col">Su</th></tr></thead>
            <tbody data-ui--calendar-target="grid" role="rowgroup"></tbody>
          </table>`).join("")}
        </div>
      </div>
    </div>
  </div>`

// Anchored so it doesn't also match the day buttons, which the calendar names
// by their full date ("Friday, June 13, 2025")
const trigger = () => screen.getByRole("button", { name: /^(Pick a date|[A-Z][a-z]+ \d{1,2}, \d{4}|\d+ dates selected)$/ })
const day = (date) => document.querySelector(`[data-date="${date}"]`)
const content = () => document.querySelector('[data-ui--popover-target="content"]')

describe("Date Picker accessibility", () => {
  afterEach(() => cleanup())

  describe("opening", () => {
    test("focus moves to the selected day", async () => {
      const { user } = await render(datePickerMarkup({ selected: ["2025-06-12"], month: "2025-06-12" }))

      await user.click(trigger())
      await settle(20)

      expect(day("2025-06-12")).toHaveFocus()
    })

    test("with two months, focus goes to the selected day in its own month, not its outside-day copy", async () => {
      const { user } = await render(datePickerMarkup({ selected: ["2025-07-01"], month: "2025-06-12", months: 2 }))

      await user.click(trigger())
      await settle(20)

      const copies = document.querySelectorAll('[data-date="2025-07-01"]')
      expect(copies.length).toBe(2)
      expect(document.activeElement).toHaveAttribute("data-date", "2025-07-01")
      expect(document.activeElement).not.toHaveAttribute("data-outside")
    })

    test("without a selection, focus moves to today", async () => {
      const { user } = await render(datePickerMarkup())

      await user.click(trigger())
      await settle(20)

      expect(day(iso(new Date()))).toHaveFocus()
    })

    test("when neither is visible, focus moves to the first day of the month", async () => {
      const { user } = await render(datePickerMarkup({ month: "2020-02-10" }))

      await user.click(trigger())
      await settle(20)

      expect(day("2020-02-01")).toHaveFocus()
    })
  })

  describe("selecting", () => {
    test("Enter on a day selects it and returns focus to the trigger", async () => {
      const { user } = await render(datePickerMarkup({ selected: ["2025-06-12"], month: "2025-06-12" }))

      await user.click(trigger())
      await settle(20)
      await user.keyboard("{ArrowRight}{Enter}")
      await settle(150)

      expect(content()).toHaveAttribute("data-state", "closed")
      expect(trigger()).toHaveTextContent("June 13, 2025")
      expect(trigger()).toHaveFocus()
    })

    test("clicking a day returns focus to the trigger", async () => {
      const { user } = await render(datePickerMarkup({ month: "2025-06-12" }))

      await user.click(trigger())
      await settle(20)
      await user.click(day("2025-06-20"))
      await settle(150)

      expect(content()).toHaveAttribute("data-state", "closed")
      expect(trigger()).toHaveFocus()
    })

    test("multiple mode stays open while picking several days", async () => {
      const { user } = await render(datePickerMarkup({ mode: "multiple", month: "2025-06-12" }))

      await user.click(trigger())
      await settle(20)
      await user.click(day("2025-06-10"))
      await settle(150)
      await user.click(day("2025-06-11"))
      await settle(150)

      expect(content()).toHaveAttribute("data-state", "open")
      expect(trigger()).toHaveTextContent("2 dates selected")
    })
  })
})
