import { Controller } from "@hotwired/stimulus"
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, addMonths, subMonths,
  isSameMonth, isSameDay, isToday, addDays,
  setMonth, setYear, getYear, getMonth, isWithinInterval,
  isBefore, isAfter, parseISO
} from "date-fns"

export default class extends Controller {
  static targets = ["grid", "monthLabel", "input", "monthSelect", "yearSelect"]

  static values = {
    mode: { type: String, default: "single" },
    selected: { type: Array, default: [] },
    month: { type: String, default: "" },
    numberOfMonths: { type: Number, default: 1 },
    weekStartsOn: { type: Number, default: 0 },
    locale: { type: String, default: "en-US" },
    minDate: { type: String, default: "" },
    maxDate: { type: String, default: "" },
    disabled: { type: Array, default: [] },
    showOutsideDays: { type: Boolean, default: true },
    fixedWeeks: { type: Boolean, default: false },
    yearRange: { type: Number, default: 100 }
  }

  connect() {
    this.currentMonth = this.monthValue ? new Date(this.monthValue) : new Date()
    this.render()
  }

  // Navigation
  previousMonth() {
    this.currentMonth = subMonths(this.currentMonth, 1)
    this.render()
  }

  nextMonth() {
    this.currentMonth = addMonths(this.currentMonth, 1)
    this.render()
  }

  goToMonth(event) {
    const month = parseInt(event.target.value)
    this.currentMonth = setMonth(this.currentMonth, month)
    this.render()
  }

  goToYear(event) {
    const year = parseInt(event.target.value)
    this.currentMonth = setYear(this.currentMonth, year)
    this.render()
  }

  // Selection handlers
  selectDate(event) {
    const dateStr = event.currentTarget.dataset.date
    if (this.isDisabled(parseISO(dateStr))) return

    // Track focused date to restore after render
    this.focusedDate = dateStr

    switch (this.modeValue) {
      case "single":
        this.selectedValue = [dateStr]
        break
      case "range":
        this.selectRange(dateStr)
        break
      case "multiple":
        this.toggleDate(dateStr)
        break
    }

    this.updateInput()
    this.render()
    this.restoreFocus()
    this.dispatch("select", { detail: { selected: this.selectedValue, date: dateStr } })
  }

  selectRange(dateStr) {
    const selected = this.selectedValue
    if (selected.length === 0 || selected.length === 2) {
      this.selectedValue = [dateStr]
    } else {
      const start = parseISO(selected[0])
      const end = parseISO(dateStr)
      this.selectedValue = isBefore(end, start)
        ? [dateStr, selected[0]]
        : [selected[0], dateStr]
    }
  }

  toggleDate(dateStr) {
    const idx = this.selectedValue.indexOf(dateStr)
    if (idx === -1) {
      this.selectedValue = [...this.selectedValue, dateStr]
    } else {
      this.selectedValue = this.selectedValue.filter((_, i) => i !== idx)
    }
  }

  // Rendering
  render() {
    this.renderMonthLabels()
    this.renderDropdowns()
    this.renderGrids()
  }

  renderMonthLabels() {
    // Handle multiple month labels for multi-month calendars
    if (this.hasMonthLabelTarget) {
      this.monthLabelTargets.forEach((label, index) => {
        const monthDate = addMonths(this.currentMonth, index)
        label.textContent = format(monthDate, "MMMM yyyy")
      })
    }
  }

  renderDropdowns() {
    // Handle multiple dropdowns for multi-month calendars
    if (this.hasMonthSelectTarget) {
      this.monthSelectTargets.forEach((select, index) => {
        const monthDate = addMonths(this.currentMonth, index)
        select.value = getMonth(monthDate)
      })
    }
    if (this.hasYearSelectTarget) {
      this.yearSelectTargets.forEach((select, index) => {
        const monthDate = addMonths(this.currentMonth, index)
        select.value = getYear(monthDate)
      })
    }
  }

  renderGrids() {
    if (!this.hasGridTarget) return

    // Render each grid with its corresponding month
    this.gridTargets.forEach((grid, index) => {
      const monthDate = addMonths(this.currentMonth, index)
      this.renderGrid(grid, monthDate)
    })
  }

  renderGrid(gridElement, monthDate) {
    const days = this.getDaysInMonth(monthDate)
    let html = ""

    // Render weeks
    for (let i = 0; i < days.length; i += 7) {
      html += '<tr class="flex w-full mt-2">'
      for (let j = i; j < i + 7 && j < days.length; j++) {
        html += this.renderDay(days[j], monthDate)
      }
      html += "</tr>"
    }

    gridElement.innerHTML = html
  }

  getDaysInMonth(monthDate) {
    const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: this.weekStartsOnValue })
    const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: this.weekStartsOnValue })

    if (this.fixedWeeksValue) {
      const days = eachDayOfInterval({ start, end })
      while (days.length < 42) {
        days.push(addDays(days[days.length - 1], 1))
      }
      return days
    }

    return eachDayOfInterval({ start, end })
  }

  renderDay(date, monthDate) {
    const dateStr = format(date, "yyyy-MM-dd")
    const isSelected = this.isSelected(date)
    const isCurrentMonth = isSameMonth(date, monthDate)
    const isTodayDate = isToday(date)
    const isDisabledDate = this.isDisabled(date)
    const isRangeMiddle = this.isInRange(date) && !isSelected

    const classes = this.getDayClasses({
      isSelected,
      isCurrentMonth,
      isTodayDate,
      isDisabled: isDisabledDate,
      isRangeMiddle,
      isRangeStart: this.isRangeStart(date),
      isRangeEnd: this.isRangeEnd(date)
    })

    // Handle outside days visibility
    if (!isCurrentMonth && !this.showOutsideDaysValue) {
      return `<td class="relative p-0 text-center text-sm h-9 w-9"></td>`
    }

    return `
      <td class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 ${this.getTdClasses(isSelected, isCurrentMonth, isRangeMiddle)}">
        <button
          type="button"
          data-date="${dateStr}"
          data-action="click->ui--calendar#selectDate"
          ${isDisabledDate ? "disabled" : ""}
          aria-selected="${isSelected}"
          class="${classes}"
          tabindex="${isSelected || isTodayDate ? 0 : -1}"
        >${date.getDate()}</button>
      </td>
    `
  }

  getTdClasses(isSelected, isCurrentMonth, isRangeMiddle) {
    const classes = []

    if (isSelected || isRangeMiddle) {
      classes.push("bg-accent")
      if (!isCurrentMonth) classes.push("bg-accent/50")
    }

    return classes.join(" ")
  }

  getDayClasses({ isSelected, isCurrentMonth, isTodayDate, isDisabled, isRangeMiddle, isRangeStart, isRangeEnd }) {
    const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 w-9 p-0 font-normal"
    const classes = [base]

    if (isSelected && !isRangeMiddle) {
      classes.push("bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground")
    } else if (isRangeMiddle) {
      classes.push("bg-accent text-accent-foreground rounded-none")
    } else if (isTodayDate && !isSelected) {
      classes.push("bg-accent text-accent-foreground")
    } else {
      classes.push("hover:bg-accent hover:text-accent-foreground")
    }

    if (!isCurrentMonth) {
      classes.push("text-muted-foreground opacity-50")
    }

    if (isDisabled) {
      classes.push("text-muted-foreground opacity-50 pointer-events-none")
    }

    if (isRangeStart) {
      classes.push("rounded-l-md rounded-r-none")
    }
    if (isRangeEnd) {
      classes.push("rounded-r-md rounded-l-none")
    }

    return classes.join(" ")
  }

  // State helpers
  isSelected(date) {
    return this.selectedValue.some(d => isSameDay(parseISO(d), date))
  }

  isDisabled(date) {
    if (this.minDateValue && isBefore(date, parseISO(this.minDateValue))) return true
    if (this.maxDateValue && isAfter(date, parseISO(this.maxDateValue))) return true
    return this.disabledValue.some(d => isSameDay(parseISO(d), date))
  }

  isInRange(date) {
    if (this.modeValue !== "range" || this.selectedValue.length !== 2) return false
    const [start, end] = this.selectedValue.map(d => parseISO(d))
    return isWithinInterval(date, { start, end })
  }

  isRangeStart(date) {
    if (this.modeValue !== "range" || this.selectedValue.length === 0) return false
    return isSameDay(parseISO(this.selectedValue[0]), date)
  }

  isRangeEnd(date) {
    if (this.modeValue !== "range" || this.selectedValue.length !== 2) return false
    return isSameDay(parseISO(this.selectedValue[1]), date)
  }

  updateInput() {
    if (this.hasInputTarget) {
      this.inputTarget.value = this.selectedValue.join(",")
    }
  }

  // Keyboard navigation
  handleKeydown(event) {
    const actions = {
      ArrowLeft: () => this.moveFocus(-1),
      ArrowRight: () => this.moveFocus(1),
      ArrowUp: () => this.moveFocus(-7),
      ArrowDown: () => this.moveFocus(7),
      PageUp: () => this.previousMonth(),
      PageDown: () => this.nextMonth(),
      Enter: () => this.selectFocusedDate(),
      " ": () => this.selectFocusedDate()
    }

    if (actions[event.key]) {
      event.preventDefault()
      actions[event.key]()
    }
  }

  moveFocus(days) {
    const focused = this.element.querySelector("[data-date]:focus")
    let currentDateStr = focused?.dataset.date || this.focusedDate

    // If no focused element and no tracked date, find the first selectable date
    if (!currentDateStr) {
      const firstButton = this.element.querySelector("[data-date]")
      if (!firstButton) return
      currentDateStr = firstButton.dataset.date
    }

    const currentDate = parseISO(currentDateStr)
    const newDate = addDays(currentDate, days)
    const newDateStr = format(newDate, "yyyy-MM-dd")

    // Track the new focused date
    this.focusedDate = newDateStr

    // Check if the new date is in the current view
    let target = this.element.querySelector(`[data-date="${newDateStr}"]`)

    if (!target) {
      // Navigate to the new month if needed
      if (days > 0) {
        this.nextMonth()
      } else {
        this.previousMonth()
      }
      // Try to find the target after rendering
      requestAnimationFrame(() => {
        target = this.element.querySelector(`[data-date="${newDateStr}"]`)
        target?.focus()
      })
    } else {
      target.focus()
    }
  }

  selectFocusedDate() {
    const focused = this.element.querySelector("[data-date]:focus")
    focused?.click()
  }

  restoreFocus() {
    if (this.focusedDate) {
      requestAnimationFrame(() => {
        const target = this.element.querySelector(`[data-date="${this.focusedDate}"]`)
        target?.focus()
      })
    }
  }
}
