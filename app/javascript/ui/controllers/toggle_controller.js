import { Controller } from "@hotwired/stimulus"
import { syncPressedState } from "../utils/state-manager.js"

/**
 * Toggle Controller
 *
 * Manages the pressed state of a toggle button with ARIA support.
 *
 * Values:
 *   - pressed: Boolean indicating if toggle is active/pressed
 *
 * Actions:
 *   - toggle: Toggles the pressed state
 *
 * Data Attributes:
 *   - data-state: "on" when pressed, "off" when not pressed
 *   - aria-pressed: "true" when pressed, "false" when not pressed
 */
export default class extends Controller {
  static values = {
    pressed: { type: Boolean, default: false }
  }

  connect() {
    // Initialize state based on value
    this.updateState()
  }

  /**
   * Toggle the pressed state
   */
  toggle() {
    this.pressedValue = !this.pressedValue
  }

  /**
   * Update data-state and aria-pressed attributes when pressed value changes
   */
  pressedValueChanged() {
    this.updateState()
  }

  /**
   * Update the button's state attributes
   */
  updateState() {
    syncPressedState(this.element, this.pressedValue, { useOnOff: true })
  }
}
