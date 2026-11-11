import { describe, test, expect, afterEach } from "bun:test"
import { screen, within } from "@testing-library/dom"
import { format } from "date-fns"
import { render, settle, cleanup } from "./support/render.js"

// Markup as UI::CalendarBehavior + _calendar.html.erb render it (classes dropped).
function header({ prev = true, next = true, dropdowns = false } = {}) {
  const middle = dropdowns
    ? `<div>
         <select data-ui--calendar-target="monthSelect" data-action="change->ui--calendar#goToMonth">
           ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
             .map((m, i) => `<option value="${i}">${m}</option>`).join("")}
         </select>
         <select data-ui--calendar-target="yearSelect" data-action="change->ui--calendar#goToYear">
           <option value="2023">2023</option><option value="2024">2024</option><option value="2025">2025</option>
         </select>
       </div>`
    : `<div data-ui--calendar-target="monthLabel"></div>`
  return `
    <div>
      ${prev ? `<button type="button" data-action="click->ui--calendar#previousMonth" aria-label="Go to previous month">‹</button>` : ""}
      ${middle}
      ${next ? `<button type="button" data-action="click->ui--calendar#nextMonth" aria-label="Go to next month">›</button>` : ""}
    </div>`
}

function month(opts) {
  return `
    <div>
      ${header(opts)}
      <table role="grid">
        <thead><tr data-ui--calendar-target="weekdaysHeader"></tr></thead>
        <tbody data-ui--calendar-target="grid" role="rowgroup"></tbody>
      </table>
    </div>`
}

function calendar({ values = {}, months = 1, dropdowns = false } = {}) {
  const attrs = Object.entries({ month: "2024-11-01", ...values })
    .map(([k, v]) => `data-ui--calendar-${k}-value='${v}'`).join(" ")
  const body = Array.from({ length: months }, (_, i) =>
    month({ prev: i === 0, next: i === months - 1, dropdowns })).join("")
  return `
    <div data-controller="ui--calendar" role="application" aria-label="Date picker"
         data-action="keydown->ui--calendar#handleKeydown" ${attrs}>
      <div class="sr-only" aria-live="polite" aria-atomic="true" data-ui--calendar-target="liveRegion"></div>
      ${body}
    </div>`
}

const day = name => screen.getByRole("button", { name })
const tabStops = () => document.querySelectorAll('[data-date][tabindex="0"]')

afterEach(() => {
  cleanup()
  delete window.matchMedia
})

describe("Calendar: day labels and grid semantics", () => {
  test("day buttons are named by the full date", async () => {
    await render(calendar())

    expect(day("Friday, November 15, 2024")).toHaveTextContent("15")
  })

  test("the grid is named by the visible month label", async () => {
    await render(calendar())

    expect(screen.getByRole("grid", { name: "November 2024" })).toBeInTheDocument()
  })

  test("with dropdowns the grid is still named by the month", async () => {
    await render(calendar({ dropdowns: true }))

    expect(screen.getByRole("grid", { name: "November 2024" })).toBeInTheDocument()
  })

  test("selection state lives on the gridcell, not on the button", async () => {
    const { user } = await render(calendar())

    await user.click(day("Friday, November 15, 2024"))

    const button = day("Friday, November 15, 2024")
    expect(button).not.toHaveAttribute("aria-selected")
    expect(button.closest("td")).toHaveAttribute("role", "gridcell")
    expect(screen.getByRole("gridcell", { selected: true })).toContainElement(button)
  })

  test("today is marked with aria-current=date", async () => {
    const today = new Date()
    await render(calendar({ values: { month: format(today, "yyyy-MM-01") } }))

    const current = document.querySelectorAll('[aria-current="date"]')
    expect(current.length).toBe(1)
    expect(current[0]).toHaveAttribute("data-date", format(today, "yyyy-MM-dd"))
  })
})

describe("Calendar: one tab stop", () => {
  test("a month without selection or today still has exactly one tab stop", async () => {
    await render(calendar())

    expect(tabStops().length).toBe(1)
    expect(tabStops()[0]).toHaveAttribute("data-date", "2024-11-01")
  })

  test("a selected range gives a single tab stop, on the start", async () => {
    await render(calendar({ values: { mode: "range", selected: '["2024-11-10","2024-11-14"]' } }))

    expect(tabStops().length).toBe(1)
    expect(tabStops()[0]).toHaveAttribute("data-date", "2024-11-10")
  })

  test("multiple selected dates give a single tab stop", async () => {
    await render(calendar({ values: { mode: "multiple", selected: '["2024-11-03","2024-11-20"]' } }))

    expect(tabStops().length).toBe(1)
  })

  test("two months give a single tab stop", async () => {
    await render(calendar({ months: 2 }))

    expect(tabStops().length).toBe(1)
  })

  test("the tab stop follows focus", async () => {
    const { user } = await render(calendar({ values: { selected: '["2024-11-15"]' } }))

    day("Friday, November 15, 2024").focus()
    await user.keyboard("{ArrowRight}")

    const saturday = day("Saturday, November 16, 2024")
    expect(saturday).toHaveFocus()
    expect(tabStops().length).toBe(1)
    expect(saturday).toHaveAttribute("tabindex", "0")
  })

  test("the tab stop skips to the nearest enabled date when the default is disabled", async () => {
    await render(calendar({ values: { "min-date": "2024-11-15" } }))

    expect(tabStops().length).toBe(1)
    expect(tabStops()[0]).toHaveAttribute("data-date", "2024-11-15")
  })

  test("navigating to another month keeps one tab stop", async () => {
    const { user } = await render(calendar({ values: { selected: '["2024-11-15"]' } }))

    await user.click(screen.getByRole("button", { name: "Go to next month" }))

    expect(tabStops().length).toBe(1)
    expect(tabStops()[0].dataset.date.startsWith("2024-12")).toBe(true)
  })
})

describe("Calendar: disabled dates", () => {
  test("disabled dates stay focusable and are aria-disabled", async () => {
    await render(calendar({ values: { disabled: '["2024-11-16"]' } }))

    const disabled = day("Saturday, November 16, 2024")
    expect(disabled).not.toHaveAttribute("disabled")
    expect(disabled).toHaveAttribute("aria-disabled", "true")
    expect(disabled.closest("td")).toHaveAttribute("aria-disabled", "true")
  })

  test("arrow keys step over disabled dates instead of getting stuck", async () => {
    const { user } = await render(calendar({ values: { selected: '["2024-11-15"]', disabled: '["2024-11-16"]' } }))

    day("Friday, November 15, 2024").focus()
    await user.keyboard("{ArrowRight}")
    expect(day("Saturday, November 16, 2024")).toHaveFocus()

    await user.keyboard("{ArrowRight}")
    expect(day("Sunday, November 17, 2024")).toHaveFocus()
  })

  test("Enter on a disabled date does not select it", async () => {
    const { user } = await render(calendar({ values: { disabled: '["2024-11-16"]' } }))

    day("Saturday, November 16, 2024").focus()
    await user.keyboard("{Enter}")

    expect(screen.queryByRole("gridcell", { selected: true })).toBeNull()
    expect(day("Saturday, November 16, 2024")).toHaveFocus()
  })

  test("focus stays on the day after selecting it (the grid re-renders)", async () => {
    const { user } = await render(calendar())

    await user.click(day("Friday, November 15, 2024"))

    expect(day("Friday, November 15, 2024")).toHaveFocus()
  })

  test("arrowing past the minimum date clamps to it", async () => {
    const { user } = await render(calendar({ values: { "min-date": "2024-11-15" } }))

    day("Friday, November 15, 2024").focus()
    await user.keyboard("{ArrowUp}")

    expect(day("Friday, November 15, 2024")).toHaveFocus()
  })
})

describe("Calendar: keyboard scope", () => {
  test("arrow keys in the month select are left to the select", async () => {
    const { user } = await render(calendar({ dropdowns: true }))
    let prevented = null
    document.addEventListener("keydown", e => { prevented = e.defaultPrevented }, { once: true })

    const select = screen.getAllByRole("combobox")[0]
    select.focus()
    await user.keyboard("{ArrowDown}")

    expect(prevented).toBe(false)
    expect(select).toHaveFocus()
  })

  test("month and year selects are labelled and use the locale", async () => {
    await render(calendar({ dropdowns: true, values: { locale: "pt-BR" } }))

    const monthSelect = screen.getByRole("combobox", { name: "mês" })
    expect(screen.getByRole("combobox", { name: "ano" })).toBeInTheDocument()
    expect(within(monthSelect).getByRole("option", { name: "novembro" })).toBeInTheDocument()
  })
})

describe("Calendar: multiple months", () => {
  test("moving into the next month focuses the in-month copy, not the outside day", async () => {
    const { user } = await render(calendar({ months: 2, values: { selected: '["2024-11-30"]' } }))

    day("Saturday, November 30, 2024").focus()
    await user.keyboard("{ArrowRight}")

    const focused = document.activeElement
    expect(focused).toHaveAttribute("data-date", "2024-12-01")
    expect(screen.getByRole("grid", { name: "December 2024" })).toContainElement(focused)
  })

  test("arrowing past the last visible month moves the view", async () => {
    const { user } = await render(calendar({ values: { selected: '["2024-11-30"]' } }))

    day("Saturday, November 30, 2024").focus()
    await user.keyboard("{ArrowRight}")

    expect(screen.getByRole("grid", { name: "December 2024" })).toContainElement(document.activeElement)
    expect(document.activeElement).toHaveAttribute("data-date", "2024-12-01")
  })
})

describe("Calendar: reduced motion", () => {
  test("month change does not animate when the user prefers reduced motion", async () => {
    window.matchMedia = query => ({ matches: query.includes("reduce"), media: query, addEventListener() {}, removeEventListener() {} })
    const { user } = await render(calendar())

    await user.click(screen.getByRole("button", { name: "Go to next month" }))
    await settle()

    expect(document.querySelector("[data-ui--calendar-target=grid]").getAttribute("style") || "").not.toContain("translate")
  })
})
