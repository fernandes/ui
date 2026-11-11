import { Controller } from "@hotwired/stimulus"

/**
 * Toggle Group Controller
 *
 * Manages single or multiple selection state for a group of toggle buttons.
 *
 * Values:
 *   - type: "single" | "multiple" - Selection mode
 *   - value: Array of selected values (stored as JSON string)
 *
 *   - loop: Boolean (default true) - Arrow keys wrap around at the ends
 *
 * Targets:
 *   - item: Individual toggle items
 *
 * Keyboard (roving tabindex, like Radix RovingFocusGroup):
 *   - Only one item is in the tab order: the last focused one, else the first
 *     pressed one, else the first enabled one.
 *   - Arrow keys move focus (Left/Right when data-orientation="horizontal",
 *     Up/Down when "vertical", both when unset); Home/End jump to the ends.
 *     Disabled items are skipped. Space/Enter toggle (native button click).
 *
 * Actions:
 *   - toggle: Toggles an item's state
 *
 * Data Attributes:
 *   - data-state: "on" when selected, "off" when not selected
 *   - aria-pressed: "true" when selected (multiple mode)
 *   - aria-checked: "true" when selected (single mode)
 */
export default class extends Controller {
  static targets = ["item"]
  static values = {
    type: { type: String, default: "single" },
    value: { type: String, default: "[]" },
    loop: { type: Boolean, default: true }
  }

  constructor() {
    super(...arguments)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleFocusin = this.handleFocusin.bind(this)
  }

  disconnect() {
    this.element.removeEventListener("keydown", this.handleKeydown)
    this.element.removeEventListener("focusin", this.handleFocusin)
  }

  connect() {
    this.element.addEventListener("keydown", this.handleKeydown)
    this.element.addEventListener("focusin", this.handleFocusin)

    // Parse initial value
    try {
      this.selectedValues = JSON.parse(this.valueValue || "[]")
      if (!Array.isArray(this.selectedValues)) {
        this.selectedValues = this.selectedValues ? [this.selectedValues] : []
      }
    } catch {
      this.selectedValues = []
    }

    // Update all items based on initial value
    this.updateAllItems()
    this.updateTabStops()
  }

  itemTargetConnected() {
    if (this.selectedValues) this.updateTabStops()
  }

  // --- Roving focus --------------------------------------------------------

  isFocusable(item) {
    return !item.disabled &&
      !item.hasAttribute("data-disabled") &&
      item.getAttribute("aria-disabled") !== "true"
  }

  focusableItems() {
    return this.itemTargets.filter(item => this.isFocusable(item))
  }

  // Exactly one enabled item gets tabindex=0.
  updateTabStops(current = null) {
    const items = this.focusableItems()
    let stop = items.includes(current) ? current : null
    if (!stop) stop = items.find(item => item === this.tabStop)
    if (!stop) stop = items.find(item => this.selectedValues.includes(item.dataset.value))
    if (!stop) stop = items[0]
    this.tabStop = stop

    this.itemTargets.forEach(item => {
      item.setAttribute("tabindex", item === stop ? "0" : "-1")
    })
  }

  handleFocusin(event) {
    const item = this.itemTargets.find(item => item === event.target)
    if (item) this.updateTabStops(item)
  }

  handleKeydown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return

    const item = this.itemTargets.find(item => item === event.target)
    if (!item) return

    const items = this.focusableItems()
    if (items.length === 0) return

    const orientation = this.element.getAttribute("data-orientation")
    const horizontal = orientation !== "vertical"
    const vertical = orientation !== "horizontal"
    let next = null

    switch (event.key) {
      case "ArrowRight":
        if (horizontal) next = this.step(items, item, 1)
        else return
        break
      case "ArrowLeft":
        if (horizontal) next = this.step(items, item, -1)
        else return
        break
      case "ArrowDown":
        if (vertical) next = this.step(items, item, 1)
        else return
        break
      case "ArrowUp":
        if (vertical) next = this.step(items, item, -1)
        else return
        break
      case "Home":
        next = items[0]
        break
      case "End":
        next = items[items.length - 1]
        break
      default:
        return
    }

    event.preventDefault()
    if (next && next !== item) next.focus()
  }

  step(items, item, direction) {
    // The focused item may itself be disabled-but-focused (e.g. disabled after focus).
    const all = this.itemTargets
    const start = all.indexOf(item)
    for (let offset = 1; offset <= all.length; offset++) {
      let index = start + direction * offset
      if (index < 0 || index >= all.length) {
        if (!this.loopValue) return null
        index = (index + all.length) % all.length
      }
      const candidate = all[index]
      if (items.includes(candidate)) return candidate
    }
    return null
  }

  /**
   * Toggle an item's state
   * @param {Event} event - Click event from item
   */
  toggle(event) {
    const item = event.currentTarget
    const value = item.dataset.value

    if (!value || !this.isFocusable(item)) return

    if (this.typeValue === "single") {
      this.toggleSingle(value, item)
    } else {
      this.toggleMultiple(value, item)
    }

    // Dispatch custom event for external listeners
    this.dispatch("change", {
      detail: {
        value: this.typeValue === "single" ? this.selectedValues[0] || null : this.selectedValues,
        type: this.typeValue
      }
    })
  }

  /**
   * Toggle in single selection mode
   * @param {string} value - Item value
   * @param {HTMLElement} item - Item element
   */
  toggleSingle(value, item) {
    const currentValue = this.selectedValues[0]

    if (currentValue === value) {
      // Deselect current item
      this.selectedValues = []
    } else {
      // Select new item
      this.selectedValues = [value]
    }

    this.updateAllItems()
  }

  /**
   * Toggle in multiple selection mode
   * @param {string} value - Item value
   * @param {HTMLElement} item - Item element
   */
  toggleMultiple(value, item) {
    const index = this.selectedValues.indexOf(value)

    if (index > -1) {
      // Remove from selection
      this.selectedValues.splice(index, 1)
    } else {
      // Add to selection
      this.selectedValues.push(value)
    }

    this.updateAllItems()
  }

  /**
   * Update all items' states based on selectedValues
   */
  updateAllItems() {
    this.itemTargets.forEach(item => {
      const value = item.dataset.value
      const isSelected = this.selectedValues.includes(value)

      // Update data-state attribute
      item.dataset.state = isSelected ? "on" : "off"
      item.setAttribute("data-state", isSelected ? "on" : "off")

      // Update ARIA attributes
      if (this.typeValue === "single") {
        item.setAttribute("aria-checked", isSelected ? "true" : "false")
      } else {
        item.setAttribute("aria-pressed", isSelected ? "true" : "false")
      }
    })

    // Update controller value
    this.valueValue = JSON.stringify(this.selectedValues)
  }

  /**
   * Get current selection
   * @returns {string|string[]|null} Current value(s)
   */
  getValue() {
    if (this.typeValue === "single") {
      return this.selectedValues[0] || null
    }
    return this.selectedValues
  }

  /**
   * Set value programmatically
   * @param {string|string[]} newValue - New value(s) to set
   */
  setValue(newValue) {
    if (this.typeValue === "single") {
      this.selectedValues = newValue ? [newValue] : []
    } else {
      this.selectedValues = Array.isArray(newValue) ? newValue : []
    }
    this.updateAllItems()
  }
}
