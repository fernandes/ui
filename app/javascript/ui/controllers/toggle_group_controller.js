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
 * Targets:
 *   - item: Individual toggle items
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
    value: { type: String, default: "[]" }
  }

  connect() {
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
  }

  /**
   * Toggle an item's state
   * @param {Event} event - Click event from item
   */
  toggle(event) {
    const item = event.currentTarget
    const value = item.dataset.value

    if (!value) return

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
