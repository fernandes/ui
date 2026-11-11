import { Controller } from "@hotwired/stimulus"
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, addMonths, subMonths, addYears, subYears,
  isSameMonth, isSameDay, isToday, addDays, differenceInDays,
  setMonth, setYear, getYear, getMonth, isWithinInterval,
  isBefore, isAfter, parseISO, differenceInCalendarMonths
} from "date-fns"
import { setIdRefs } from "../utils/id-manager.js"

// How far ensureFocusedDate looks for an enabled date to use as the tab stop
const MAX_FALLBACK_DAYS = 62

export default class extends Controller {
  static targets = ["grid", "monthLabel", "input", "monthSelect", "yearSelect", "liveRegion", "weekdaysHeader", "monthContainer"]

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
    yearRange: { type: Number, default: 100 },
    // Range constraints
    minRangeDays: { type: Number, default: 0 },
    maxRangeDays: { type: Number, default: 0 },
    excludeDisabled: { type: Boolean, default: false }
  }

  connect() {
    // parseISO reads a bare "yyyy-MM-dd" as local time; `new Date()` reads it
    // as UTC, which west of Greenwich lands on the previous day (and month).
    this.currentMonth = this.monthValue ? parseISO(this.monthValue) : new Date()
    this.hoveredDate = null // For range preview
    this.animationDirection = null // For month transition animation
    this.initializeLocale()
    this.render()
    this.renderWeekdayHeaders()
  }

  disconnect() {
    this.hoveredDate = null
  }

  // Initialize locale-aware formatters using Intl API
  initializeLocale() {
    const locale = this.localeValue || "en-US"

    // Month formatter for labels (e.g., "November 2024")
    this.monthFormatter = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric"
    })

    // Short weekday formatter (e.g., "Su", "Mo")
    this.weekdayFormatter = new Intl.DateTimeFormat(locale, {
      weekday: "short"
    })

    // Full weekday formatter for aria-labels (e.g., "Sunday")
    this.weekdayFullFormatter = new Intl.DateTimeFormat(locale, {
      weekday: "long"
    })

    // Month name formatter for dropdowns (e.g., "November")
    this.monthNameFormatter = new Intl.DateTimeFormat(locale, {
      month: "long"
    })

    // Day formatter for aria-labels (e.g., "Friday, November 15, 2024")
    this.dayFormatter = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  // Navigation
  previousMonth() {
    this.animationDirection = "prev"
    this.currentMonth = subMonths(this.currentMonth, 1)
    this.render()
    this.announceMonthChange()
    this.dispatchMonthChange()
  }

  nextMonth() {
    this.animationDirection = "next"
    this.currentMonth = addMonths(this.currentMonth, 1)
    this.render()
    this.announceMonthChange()
    this.dispatchMonthChange()
  }

  previousYear() {
    this.animationDirection = "prev"
    this.currentMonth = subYears(this.currentMonth, 1)
    this.render()
    this.announceMonthChange()
    this.dispatchMonthChange()
  }

  nextYear() {
    this.animationDirection = "next"
    this.currentMonth = addYears(this.currentMonth, 1)
    this.render()
    this.announceMonthChange()
    this.dispatchMonthChange()
  }

  goToMonth(event) {
    const month = parseInt(event.target.value)
    const oldMonth = getMonth(this.currentMonth)
    this.animationDirection = month > oldMonth ? "next" : "prev"
    this.currentMonth = setMonth(this.currentMonth, month)
    this.render()
    this.announceMonthChange()
    this.dispatchMonthChange()
  }

  goToYear(event) {
    const year = parseInt(event.target.value)
    const oldYear = getYear(this.currentMonth)
    this.animationDirection = year > oldYear ? "next" : "prev"
    this.currentMonth = setYear(this.currentMonth, year)
    this.render()
    this.announceMonthChange()
    this.dispatchMonthChange()
  }

  // Go to today's date
  goToToday() {
    const today = new Date()
    const oldMonth = this.currentMonth
    this.animationDirection = isBefore(oldMonth, today) ? "next" : "prev"
    this.currentMonth = startOfMonth(today)
    this.focusedDate = format(today, "yyyy-MM-dd")
    this.render()
    this.announceMonthChange()
    this.dispatchMonthChange()
    this.restoreFocus()
  }

  // Localized name of a date field ("Month" / "mês"), for the dropdown labels
  fieldName(field, fallback) {
    try {
      return new Intl.DisplayNames(this.localeValue || "en-US", { type: "dateTimeField" }).of(field) || fallback
    } catch {
      return fallback
    }
  }

  // Dispatch month change event
  dispatchMonthChange() {
    this.dispatch("monthChange", {
      detail: {
        month: this.currentMonth,
        direction: this.animationDirection
      }
    })
  }

  // Announce month changes to screen readers via aria-live region
  announceMonthChange() {
    if (this.hasLiveRegionTarget) {
      const monthName = this.monthFormatter.format(this.currentMonth)
      this.liveRegionTarget.textContent = monthName
    }
  }

  // Announce date selection to screen readers
  announceSelection(dateStr) {
    if (this.hasLiveRegionTarget) {
      const date = parseISO(dateStr)
      const formattedDate = this.dayFormatter.format(date)
      this.liveRegionTarget.textContent = `Selected: ${formattedDate}`
    }
  }

  // Selection handlers
  selectDate(event) {
    // Stop propagation to prevent popover's handleClickOutside from closing the popover
    // This is necessary because render() replaces the DOM, removing event.target from the document
    // which would make contains() return false in handleClickOutside
    event.stopPropagation()

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
    this.announceSelection(dateStr)
    this.dispatch("select", { detail: { selected: this.selectedValue, date: dateStr } })
  }

  selectRange(dateStr) {
    const selected = this.selectedValue
    if (selected.length === 0 || selected.length === 2) {
      this.selectedValue = [dateStr]
    } else {
      const start = parseISO(selected[0])
      const end = parseISO(dateStr)

      // Swap if end is before start
      const [rangeStart, rangeEnd] = isBefore(end, start)
        ? [end, start]
        : [start, end]

      // Validate min/max range days
      const daysDiff = differenceInDays(rangeEnd, rangeStart)

      if (this.minRangeDaysValue > 0 && daysDiff < this.minRangeDaysValue) {
        // Range too short, don't complete selection
        this.dispatch("rangeError", {
          detail: { error: "min", minDays: this.minRangeDaysValue, actualDays: daysDiff }
        })
        return
      }

      if (this.maxRangeDaysValue > 0 && daysDiff > this.maxRangeDaysValue) {
        // Range too long, don't complete selection
        this.dispatch("rangeError", {
          detail: { error: "max", maxDays: this.maxRangeDaysValue, actualDays: daysDiff }
        })
        return
      }

      // Check for disabled dates in range if excludeDisabled is true
      if (this.excludeDisabledValue) {
        const hasDisabledInRange = this.hasDisabledDatesInRange(rangeStart, rangeEnd)
        if (hasDisabledInRange) {
          // Don't complete selection if there are disabled dates in range
          this.dispatch("rangeError", {
            detail: { error: "disabled", message: "Range contains disabled dates" }
          })
          return
        }
      }

      this.selectedValue = [format(rangeStart, "yyyy-MM-dd"), format(rangeEnd, "yyyy-MM-dd")]
    }
  }

  // Check if there are any disabled dates within a range
  hasDisabledDatesInRange(start, end) {
    const days = eachDayOfInterval({ start, end })
    return days.some(day => this.isDisabled(day))
  }

  toggleDate(dateStr) {
    const idx = this.selectedValue.indexOf(dateStr)
    if (idx === -1) {
      this.selectedValue = [...this.selectedValue, dateStr]
    } else {
      this.selectedValue = this.selectedValue.filter((_, i) => i !== idx)
    }
  }

  // Hover preview for range mode
  handleDayHover(event) {
    if (this.modeValue !== "range") return
    if (this.selectedValue.length !== 1) return

    const dateStr = event.currentTarget.dataset.date
    if (!dateStr) return

    this.hoveredDate = parseISO(dateStr)
    this.updateRangePreview()
  }

  handleDayLeave() {
    if (this.modeValue !== "range") return
    if (!this.hoveredDate) return

    this.hoveredDate = null
    this.updateRangePreview()
  }

  // Update visual preview for range selection
  updateRangePreview() {
    if (!this.hasGridTarget) return

    const buttons = this.element.querySelectorAll("[data-date]")
    buttons.forEach(button => {
      const dateStr = button.dataset.date
      const date = parseISO(dateStr)
      const isInPreview = this.isInRangePreview(date)
      const isPreviewStart = this.isRangePreviewStart(date)
      const isPreviewEnd = this.isRangePreviewEnd(date)
      const td = button.closest("td")

      // Update td background for preview
      if (td) {
        td.classList.toggle("bg-accent/50", isInPreview && !this.isSelected(date))
      }

      // Update button classes for preview
      button.classList.toggle("bg-accent/50", isInPreview && !this.isSelected(date))

      // Update rounding for preview start/end
      if (isPreviewStart && !isPreviewEnd) {
        button.classList.add("rounded-l-md", "rounded-r-none")
      } else if (isPreviewEnd && !isPreviewStart) {
        button.classList.add("rounded-r-md", "rounded-l-none")
      } else if (!isInPreview) {
        // Reset rounding only if not in actual selection
        if (!this.isRangeStart(date) && !this.isRangeEnd(date)) {
          button.classList.remove("rounded-l-md", "rounded-r-md", "rounded-l-none", "rounded-r-none")
          button.classList.add("rounded-md")
        }
      }
    })
  }

  // Check if date is in the preview range (between selected start and hovered date)
  isInRangePreview(date) {
    if (this.modeValue !== "range") return false
    if (this.selectedValue.length !== 1) return false
    if (!this.hoveredDate) return false

    const start = parseISO(this.selectedValue[0])
    const end = this.hoveredDate

    const [rangeStart, rangeEnd] = isBefore(end, start) ? [end, start] : [start, end]
    return isWithinInterval(date, { start: rangeStart, end: rangeEnd })
  }

  isRangePreviewStart(date) {
    if (!this.isInRangePreview(date)) return false
    const start = parseISO(this.selectedValue[0])
    const end = this.hoveredDate
    const actualStart = isBefore(end, start) ? end : start
    return isSameDay(date, actualStart)
  }

  isRangePreviewEnd(date) {
    if (!this.isInRangePreview(date)) return false
    const start = parseISO(this.selectedValue[0])
    const end = this.hoveredDate
    const actualEnd = isBefore(end, start) ? start : end
    return isSameDay(date, actualEnd)
  }

  // Rendering
  render() {
    this.ensureFocusedDate()
    this.renderMonthLabels()
    this.renderDropdowns()
    this.renderGrids()
  }

  // First and last day of the months on screen
  visibleRange() {
    return {
      start: startOfMonth(this.currentMonth),
      end: endOfMonth(addMonths(this.currentMonth, Math.max(this.numberOfMonthsValue, 1) - 1))
    }
  }

  isVisible(date) {
    if (!date) return false
    const { start, end } = this.visibleRange()
    return !isBefore(date, start) && !isAfter(date, end)
  }

  // The grid has exactly one tab stop: the focused date (React Aria `focusedDate`).
  // When it isn't on screen it falls back to the first visible selected date,
  // then today, then the first of the month - skipping to the nearest enabled
  // date so Tab never lands on a date that can't be picked.
  ensureFocusedDate() {
    const current = this.focusedDate ? parseISO(this.focusedDate) : null
    if (this.isVisible(current)) return

    const selected = this.selectedValue.map(d => parseISO(d)).find(d => this.isVisible(d))
    const today = new Date()
    let date = selected || (this.isVisible(today) ? today : this.visibleRange().start)
    if (this.isDisabled(date)) date = this.nearestEnabledDate(date) || date

    this.focusedDate = format(date, "yyyy-MM-dd")
  }

  nearestEnabledDate(date) {
    for (let offset = 1; offset <= MAX_FALLBACK_DAYS; offset++) {
      for (const candidate of [addDays(date, offset), addDays(date, -offset)]) {
        if (this.isVisible(candidate) && !this.isDisabled(candidate)) return candidate
      }
    }
    return null
  }

  // The button for a date, preferring the copy inside its own month over an
  // outside-day copy shown in a neighbouring month
  dayButton(dateStr) {
    return this.element.querySelector(`[data-date="${dateStr}"]:not([data-outside])`) ||
      this.element.querySelector(`[data-date="${dateStr}"]`)
  }

  updateTabStop(target = this.dayButton(this.focusedDate)) {
    this.element.querySelectorAll("[data-date]").forEach(button => {
      button.setAttribute("tabindex", button === target ? "0" : "-1")
    })
  }

  // Move keyboard focus to a date, changing the visible months if needed.
  // Focus is clamped to min/max dates.
  focusDate(date) {
    if (this.minDateValue && isBefore(date, parseISO(this.minDateValue))) date = parseISO(this.minDateValue)
    if (this.maxDateValue && isAfter(date, parseISO(this.maxDateValue))) date = parseISO(this.maxDateValue)

    this.focusedDate = format(date, "yyyy-MM-dd")

    if (this.isVisible(date)) {
      this.updateTabStop()
    } else {
      const before = isBefore(date, this.visibleRange().start)
      this.animationDirection = before ? "prev" : "next"
      this.currentMonth = before
        ? startOfMonth(date)
        : startOfMonth(subMonths(date, Math.max(this.numberOfMonthsValue, 1) - 1))
      this.render()
      this.announceMonthChange()
      this.dispatchMonthChange()
    }

    this.restoreFocus()
  }

  renderMonthLabels() {
    // Handle multiple month labels for multi-month calendars
    if (this.hasMonthLabelTarget) {
      this.monthLabelTargets.forEach((label, index) => {
        const monthDate = addMonths(this.currentMonth, index)
        // Use locale-aware formatter
        label.textContent = this.monthFormatter.format(monthDate)
      })
    }
  }

  // Render localized weekday headers
  renderWeekdayHeaders() {
    if (!this.hasWeekdaysHeaderTarget) return

    this.weekdaysHeaderTargets.forEach(header => {
      const weekdays = this.getLocalizedWeekdays()
      header.innerHTML = weekdays.map(day =>
        `<th scope="col" class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]" aria-label="${day.full}">${day.short}</th>`
      ).join("")
    })
  }

  // Get localized weekday names respecting weekStartsOn
  getLocalizedWeekdays() {
    const weekdays = []
    // Start from a known Sunday (Jan 4, 1970 was a Sunday)
    const baseSunday = new Date(1970, 0, 4)

    for (let i = 0; i < 7; i++) {
      const dayIndex = (i + this.weekStartsOnValue) % 7
      const date = new Date(baseSunday)
      date.setDate(baseSunday.getDate() + dayIndex)

      weekdays.push({
        short: this.weekdayFormatter.format(date).slice(0, 2), // "Su", "Mo", etc.
        full: this.weekdayFullFormatter.format(date) // "Sunday", "Monday", etc.
      })
    }

    return weekdays
  }

  // Get localized month names for dropdowns
  getLocalizedMonthNames() {
    const months = []
    for (let i = 0; i < 12; i++) {
      const date = new Date(2024, i, 1) // Any year works
      months.push({
        value: i,
        name: this.monthNameFormatter.format(date)
      })
    }
    return months
  }

  renderDropdowns() {
    // Handle multiple dropdowns for multi-month calendars
    if (this.hasMonthSelectTarget) {
      this.monthSelectTargets.forEach((select, index) => {
        const monthDate = addMonths(this.currentMonth, index)
        const value = getMonth(monthDate).toString()
        this.localizeMonthOptions(select)
        this.labelSelect(select, this.fieldName("month", "Month"))
        this.updateSelectValue(select, value)
      })
    }
    if (this.hasYearSelectTarget) {
      this.yearSelectTargets.forEach((select, index) => {
        const monthDate = addMonths(this.currentMonth, index)
        const value = getYear(monthDate).toString()
        this.labelSelect(select, this.fieldName("year", "Year"))
        this.updateSelectValue(select, value)
      })
    }
  }

  // Name the native select, or the UI Select trigger, unless the author did
  labelSelect(element, label) {
    const target = element.tagName === "SELECT"
      ? element
      : element.closest("[data-controller~='ui--select']")?.querySelector("[data-ui--select-target='trigger']")
    if (!target || target.hasAttribute("aria-labelledby")) return
    if (target.hasAttribute("aria-label") && !target.hasAttribute("data-calendar-label")) return

    target.setAttribute("aria-label", label)
    target.setAttribute("data-calendar-label", "")
  }

  // Ruby renders the month names in English; show them in the calendar's locale
  localizeMonthOptions(select) {
    if (select.tagName !== "SELECT" || select.dataset.localized === this.localeValue) return

    const names = this.getLocalizedMonthNames()
    Array.from(select.options).forEach(option => {
      const month = names[parseInt(option.value)]
      if (month) option.textContent = month.name
    })
    select.dataset.localized = this.localeValue
  }

  // Update select value - works with both native selects and UI Select component
  updateSelectValue(element, value) {
    // For native select elements
    if (element.tagName === "SELECT") {
      element.value = value
      return
    }

    // For hidden inputs inside UI Select component
    element.value = value

    // Find parent UI Select controller and update its value
    const selectElement = element.closest("[data-controller='ui--select']")
    if (selectElement) {
      selectElement.dataset.uiSelectValueValue = value
    }
  }

  renderGrids() {
    if (!this.hasGridTarget) return

    // Animate month transitions
    if (this.animationDirection) {
      if (this.prefersReducedMotion()) {
        this.animationDirection = null
      } else {
        this.animateMonthTransition()
      }
    }

    // Render each grid with its corresponding month
    this.gridTargets.forEach((grid, index) => {
      const monthDate = addMonths(this.currentMonth, index)
      this.renderGrid(grid, monthDate)
      this.labelGrid(grid, index, monthDate)
    })

    this.updateTabStop()
  }

  // Name each grid by its visible month label, or by the month itself when
  // dropdowns replace the label
  labelGrid(grid, index, monthDate) {
    const table = grid.closest("table") || grid
    const label = this.monthLabelTargets[index]
    if (label) {
      setIdRefs(table, "aria-labelledby", label, { prefix: "calendar-month" })
    } else if (!table.hasAttribute("aria-labelledby")) {
      table.setAttribute("aria-label", this.monthFormatter.format(monthDate))
    }
  }

  prefersReducedMotion() {
    return typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  // Animate month transition with fade and slide effect
  animateMonthTransition() {
    this.gridTargets.forEach(grid => {
      // Set initial state for animation
      grid.style.opacity = "0"
      grid.style.transform = this.animationDirection === "next" ? "translateX(10px)" : "translateX(-10px)"

      // Trigger animation after content is rendered
      requestAnimationFrame(() => {
        grid.style.transition = "opacity 150ms ease-out, transform 150ms ease-out"
        grid.style.opacity = "1"
        grid.style.transform = "translateX(0)"
      })

      // Clean up after animation
      setTimeout(() => {
        grid.style.transition = ""
        grid.style.transform = ""
        this.animationDirection = null
      }, 160)
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

    // Build data-action with hover events for range mode
    let actions = "click->ui--calendar#selectDate focus->ui--calendar#handleDayFocus blur->ui--calendar#handleDayBlur"
    if (this.modeValue === "range") {
      actions += " mouseenter->ui--calendar#handleDayHover mouseleave->ui--calendar#handleDayLeave"
    }

    // React Aria useCalendarCell: selection state on the gridcell, the full
    // date as the button's name, and disabled dates stay focusable
    // (aria-disabled) so arrow keys can move across them. The tab stop is
    // set by updateTabStop().
    const disabledAttr = isDisabledDate ? 'aria-disabled="true"' : ""

    return `
      <td role="gridcell" aria-selected="${isSelected}" ${disabledAttr} class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 ${this.getTdClasses(isSelected, isCurrentMonth, isRangeMiddle)}">
        <button
          type="button"
          data-date="${dateStr}"
          data-action="${actions}"
          aria-label="${this.dayFormatter.format(date)}"
          ${isTodayDate ? 'aria-current="date"' : ""}
          ${disabledAttr}
          ${isCurrentMonth ? "" : "data-outside"}
          class="${classes}"
          tabindex="-1"
        >${date.getDate()}</button>
      </td>
    `
  }

  // Day focus event handler
  handleDayFocus(event) {
    const dateStr = event.currentTarget.dataset.date
    if (!dateStr) return

    // Roving tabindex: the focused day is the grid's tab stop
    this.focusedDate = dateStr
    this.updateTabStop(event.currentTarget)

    this.dispatch("dayFocus", {
      detail: { date: dateStr, element: event.currentTarget }
    })
  }

  // Day blur event handler
  handleDayBlur(event) {
    const dateStr = event.currentTarget.dataset.date
    if (!dateStr) return

    this.dispatch("dayBlur", {
      detail: { date: dateStr, element: event.currentTarget }
    })
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
  // Supports:
  // - Arrow keys: move focus by day/week
  // - Shift+Arrow Left/Right: move by month
  // - Shift+Arrow Up/Down: move by year
  // - PageUp/PageDown: previous/next month
  // - Shift+PageUp/PageDown: previous/next year
  // - Home/End: start/end of week
  // - Enter/Space: select focused date
  handleKeydown(event) {
    // Only keys pressed on a day belong to the grid: the month/year selects,
    // the nav buttons and anything else inside the calendar keep their keys
    const day = document.activeElement?.closest?.("[data-date]")
    if (!day || !this.element.contains(day)) return

    // Handle Shift+Arrow combinations for month/year navigation
    if (event.shiftKey) {
      const shiftActions = {
        ArrowLeft: () => this.navigateAndFocus("previousMonth"),
        ArrowRight: () => this.navigateAndFocus("nextMonth"),
        ArrowUp: () => this.navigateAndFocus("previousYear"),
        ArrowDown: () => this.navigateAndFocus("nextYear"),
        PageUp: () => this.navigateAndFocus("previousYear"),
        PageDown: () => this.navigateAndFocus("nextYear")
      }

      if (shiftActions[event.key]) {
        event.preventDefault()
        shiftActions[event.key]()
        return
      }
    }

    const actions = {
      ArrowLeft: () => this.moveFocus(-1),
      ArrowRight: () => this.moveFocus(1),
      ArrowUp: () => this.moveFocus(-7),
      ArrowDown: () => this.moveFocus(7),
      PageUp: () => this.navigateAndFocus("previousMonth"),
      PageDown: () => this.navigateAndFocus("nextMonth"),
      Home: () => this.moveToStartOfWeek(),
      End: () => this.moveToEndOfWeek(),
      Enter: () => this.selectFocusedDate(),
      " ": () => this.selectFocusedDate()
    }

    if (actions[event.key]) {
      event.preventDefault()
      actions[event.key]()
    }
  }

  // The date keyboard navigation starts from
  currentFocusDate() {
    const focused = this.element.querySelector("[data-date]:focus")
    const dateStr = focused?.dataset.date || this.focusedDate
    if (dateStr) return parseISO(dateStr)

    const firstButton = this.element.querySelector("[data-date]")
    return firstButton ? parseISO(firstButton.dataset.date) : null
  }

  moveFocus(days) {
    const current = this.currentFocusDate()
    if (current) this.focusDate(addDays(current, days))
  }

  selectFocusedDate() {
    const focused = this.element.querySelector("[data-date]:focus")
    focused?.click()
  }

  restoreFocus() {
    if (this.focusedDate) this.dayButton(this.focusedDate)?.focus()
  }

  // Navigate by month/year while keeping focus on the same day-of-month
  // when possible
  navigateAndFocus(direction) {
    const focused = this.element.querySelector("[data-date]:focus")
    const currentDateStr = focused?.dataset.date || this.focusedDate

    if (!currentDateStr) {
      // No focus, just navigate
      this[direction]()
      return
    }

    const currentDate = parseISO(currentDateStr)
    const shifts = {
      previousMonth: () => subMonths(currentDate, 1),
      nextMonth: () => addMonths(currentDate, 1),
      previousYear: () => subYears(currentDate, 1),
      nextYear: () => addYears(currentDate, 1)
    }
    const newDate = shifts[direction]()

    // Page the view by the same number of months, like the nav buttons
    const months = differenceInCalendarMonths(newDate, currentDate)
    this.animationDirection = months > 0 ? "next" : "prev"
    this.currentMonth = addMonths(this.currentMonth, months)
    this.focusedDate = format(newDate, "yyyy-MM-dd")
    this.render()
    this.announceMonthChange()
    this.dispatchMonthChange()
    this.restoreFocus()
  }

  // Move focus to start of current week
  moveToStartOfWeek() {
    const current = this.currentFocusDate()
    if (current) this.focusDate(startOfWeek(current, { weekStartsOn: this.weekStartsOnValue }))
  }

  // Move focus to end of current week
  moveToEndOfWeek() {
    const current = this.currentFocusDate()
    if (current) this.focusDate(endOfWeek(current, { weekStartsOn: this.weekStartsOnValue }))
  }
}
