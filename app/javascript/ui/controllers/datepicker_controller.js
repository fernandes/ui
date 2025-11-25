import { Controller } from "@hotwired/stimulus"
import { format, parse, isValid, parseISO } from "date-fns"

/**
 * DatePicker Controller
 *
 * Coordinates a Popover with a Calendar for date selection.
 * Supports two modes:
 * 1. Button trigger mode: Click button to open calendar, shows selected date in button
 * 2. Input mode: Text input for manual date entry + button to open calendar
 *
 * @example Button trigger mode
 * <div data-controller="ui--datepicker" data-ui--datepicker-ui--popover-outlet="#popover">
 *   <button data-ui--datepicker-target="trigger" data-ui--datepicker-target="label">
 *     Select date
 *   </button>
 *   <div data-controller="ui--popover" id="popover">
 *     <div data-controller="ui--calendar"
 *          data-action="ui--calendar:select->ui--datepicker#handleSelect">
 *     </div>
 *   </div>
 * </div>
 *
 * @example Input mode
 * <div data-controller="ui--datepicker">
 *   <input data-ui--datepicker-target="input" data-action="input->ui--datepicker#handleInput keydown->ui--datepicker#handleInputKeydown">
 *   <button data-ui--datepicker-target="trigger">📅</button>
 *   <div data-controller="ui--popover ui--calendar">...</div>
 * </div>
 */
export default class extends Controller {
  static targets = ["trigger", "label", "input", "hiddenInput", "calendar"]
  static outlets = ["ui--popover", "ui--calendar"]

  static values = {
    // Date format for display (using Intl.DateTimeFormat options)
    format: { type: String, default: "long" }, // "short", "medium", "long", "full" or custom pattern
    // Locale for date formatting
    locale: { type: String, default: "en-US" },
    // Placeholder text when no date selected
    placeholder: { type: String, default: "Select date" },
    // Range placeholder
    rangePlaceholder: { type: String, default: "Select date range" },
    // Close popover after selection
    closeOnSelect: { type: Boolean, default: true },
    // Selection mode (inherited from calendar, used to determine when to close)
    mode: { type: String, default: "single" },
    // Current selected value(s) - ISO format
    selected: { type: Array, default: [] },
    // Input date format for parsing user input
    inputFormat: { type: String, default: "yyyy-MM-dd" }
  }

  connect() {
    // Initialize display from selected value if provided
    if (this.selectedValue.length > 0) {
      this.updateDisplay()
    }
  }

  // Handle date selection from calendar
  handleSelect(event) {
    const { selected, date } = event.detail

    // Update our selected value
    this.selectedValue = selected

    // Update the display (button text or input value)
    this.updateDisplay()

    // Update hidden input for forms
    this.updateHiddenInput()

    // Determine if we should close the popover
    if (this.shouldClosePopover()) {
      this.closePopover()
    }

    // Dispatch our own select event for external listeners
    this.dispatch("select", {
      detail: {
        selected: this.selectedValue,
        date,
        formatted: this.getFormattedDate()
      }
    })
  }

  // Handle manual input in text field
  handleInput(event) {
    const inputValue = event.target.value

    if (!inputValue.trim()) {
      this.selectedValue = []
      this.syncCalendarMonth(new Date())
      return
    }

    // Try to parse the date from input
    const parsedDate = this.parseInputDate(inputValue)

    if (parsedDate && isValid(parsedDate)) {
      const dateStr = format(parsedDate, "yyyy-MM-dd")
      this.selectedValue = [dateStr]

      // Sync calendar to show the parsed date's month
      this.syncCalendarMonth(parsedDate)
      this.syncCalendarSelection([dateStr])
    }
  }

  // Handle keydown on input - ArrowDown opens calendar
  handleInputKeydown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      this.openPopover()
    }
  }

  // Parse date from user input
  parseInputDate(value) {
    // Try multiple common formats
    const formats = [
      "yyyy-MM-dd",
      "MM/dd/yyyy",
      "dd/MM/yyyy",
      "MMMM dd, yyyy",
      "MMM dd, yyyy",
      "dd MMMM yyyy",
      "dd MMM yyyy"
    ]

    // First try native Date parsing
    const nativeDate = new Date(value)
    if (isValid(nativeDate) && !isNaN(nativeDate.getTime())) {
      return nativeDate
    }

    // Try each format
    for (const fmt of formats) {
      try {
        const parsed = parse(value, fmt, new Date())
        if (isValid(parsed)) {
          return parsed
        }
      } catch {
        // Continue to next format
      }
    }

    return null
  }

  // Update the display element (button label or input)
  updateDisplay() {
    const formatted = this.getFormattedDate()

    // Update label target (for button mode)
    if (this.hasLabelTarget) {
      this.labelTarget.textContent = formatted
    }

    // Update input target (for input mode)
    if (this.hasInputTarget) {
      this.inputTarget.value = formatted
    }

    // Update trigger if it's the display element
    if (this.hasTriggerTarget && !this.hasLabelTarget && !this.hasInputTarget) {
      this.triggerTarget.textContent = formatted
    }
  }

  // Update hidden input for form submission
  updateHiddenInput() {
    if (this.hasHiddenInputTarget) {
      if (this.modeValue === "range" && this.selectedValue.length === 2) {
        this.hiddenInputTarget.value = this.selectedValue.join(",")
      } else if (this.selectedValue.length > 0) {
        this.hiddenInputTarget.value = this.selectedValue.join(",")
      } else {
        this.hiddenInputTarget.value = ""
      }
    }
  }

  // Get formatted date string for display
  getFormattedDate() {
    if (this.selectedValue.length === 0) {
      return this.modeValue === "range"
        ? this.rangePlaceholderValue
        : this.placeholderValue
    }

    if (this.modeValue === "range") {
      return this.formatRangeDate()
    }

    if (this.modeValue === "multiple") {
      return this.formatMultipleDates()
    }

    // Single date
    return this.formatSingleDate(this.selectedValue[0])
  }

  // Format a single date
  formatSingleDate(dateStr) {
    if (!dateStr) return this.placeholderValue

    try {
      const date = parseISO(dateStr)
      if (!isValid(date)) return this.placeholderValue

      // Use Intl.DateTimeFormat for locale-aware formatting
      const options = this.getDateFormatOptions()
      const formatter = new Intl.DateTimeFormat(this.localeValue, options)
      return formatter.format(date)
    } catch {
      return this.placeholderValue
    }
  }

  // Format date range
  formatRangeDate() {
    if (this.selectedValue.length === 0) {
      return this.rangePlaceholderValue
    }

    if (this.selectedValue.length === 1) {
      return this.formatSingleDate(this.selectedValue[0]) + " - ..."
    }

    const start = this.formatSingleDate(this.selectedValue[0])
    const end = this.formatSingleDate(this.selectedValue[1])
    return `${start} - ${end}`
  }

  // Format multiple dates
  formatMultipleDates() {
    if (this.selectedValue.length === 0) {
      return this.placeholderValue
    }

    if (this.selectedValue.length === 1) {
      return this.formatSingleDate(this.selectedValue[0])
    }

    // Show count for multiple dates
    return `${this.selectedValue.length} dates selected`
  }

  // Get Intl.DateTimeFormat options based on format value
  getDateFormatOptions() {
    switch (this.formatValue) {
      case "short":
        return { dateStyle: "short" }
      case "medium":
        return { dateStyle: "medium" }
      case "long":
        return { dateStyle: "long" }
      case "full":
        return { dateStyle: "full" }
      default:
        // Default to long format
        return { dateStyle: "long" }
    }
  }

  // Determine if popover should close after selection
  shouldClosePopover() {
    if (!this.closeOnSelectValue) return false

    switch (this.modeValue) {
      case "single":
        // Close immediately for single selection
        return this.selectedValue.length === 1
      case "range":
        // Close only when range is complete (2 dates)
        return this.selectedValue.length === 2
      case "multiple":
        // Never auto-close for multiple selection
        return false
      default:
        return true
    }
  }

  // Close the popover
  closePopover() {
    // Try outlet first
    if (this.hasUiPopoverOutlet) {
      this.uiPopoverOutlet.hide()
      return
    }

    // Try finding popover within this element
    const popoverElement = this.element.querySelector("[data-controller*='ui--popover']")
    if (popoverElement) {
      const popoverController = this.application.getControllerForElementAndIdentifier(
        popoverElement,
        "ui--popover"
      )
      if (popoverController) {
        popoverController.hide()
      }
    }
  }

  // Open the popover
  openPopover() {
    // Try outlet first
    if (this.hasUiPopoverOutlet) {
      this.uiPopoverOutlet.show()
      return
    }

    // Try finding popover within this element
    const popoverElement = this.element.querySelector("[data-controller*='ui--popover']")
    if (popoverElement) {
      const popoverController = this.application.getControllerForElementAndIdentifier(
        popoverElement,
        "ui--popover"
      )
      if (popoverController) {
        popoverController.show()
      }
    }
  }

  // Sync calendar to show specific month
  syncCalendarMonth(date) {
    // Try outlet first
    if (this.hasUiCalendarOutlet) {
      this.uiCalendarOutlet.currentMonth = date
      this.uiCalendarOutlet.render()
      return
    }

    // Try finding calendar within this element
    const calendarElement = this.element.querySelector("[data-controller*='ui--calendar']")
    if (calendarElement) {
      const calendarController = this.application.getControllerForElementAndIdentifier(
        calendarElement,
        "ui--calendar"
      )
      if (calendarController) {
        calendarController.currentMonth = date
        calendarController.render()
      }
    }
  }

  // Sync calendar selection
  syncCalendarSelection(selected) {
    // Try outlet first
    if (this.hasUiCalendarOutlet) {
      this.uiCalendarOutlet.selectedValue = selected
      this.uiCalendarOutlet.render()
      return
    }

    // Try finding calendar within this element
    const calendarElement = this.element.querySelector("[data-controller*='ui--calendar']")
    if (calendarElement) {
      const calendarController = this.application.getControllerForElementAndIdentifier(
        calendarElement,
        "ui--calendar"
      )
      if (calendarController) {
        calendarController.selectedValue = selected
        calendarController.render()
      }
    }
  }

  // Action to toggle popover (for trigger button)
  toggle(event) {
    event.preventDefault()
    event.stopPropagation()

    // The popover controller will handle this, but we can also control it
    // This is useful when the trigger is outside the popover
  }
}
