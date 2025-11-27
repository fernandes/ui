import { Controller } from "@hotwired/stimulus"
import { syncCheckedState } from "../utils/state-manager.js"

// Switch controller for toggle switches
//
// Manages the state and interactions for a binary toggle switch component.
// Implements Radix UI Switch behavior with keyboard support (Space/Enter).
//
// Targets:
//   thumb - The circular thumb element that moves on toggle
//
// Values:
//   checked - Boolean state of the switch
//
// Actions:
//   click->ui--switch#toggle - Toggle the switch state
//
// Events:
//   change - Dispatched when switch state changes (bubbles for form integration)
//
// Example:
//   <button data-controller="ui--switch" data-ui--switch-checked-value="false">
//     <span data-ui--switch-target="thumb"></span>
//   </button>
export default class extends Controller {
  static targets = ["thumb"]
  static values = {
    checked: { type: Boolean, default: false }
  }

  connect() {
    this.updateState(this.checkedValue, false)
  }

  toggle(event) {
    if (event) {
      event.preventDefault()
    }

    // Don't toggle if disabled
    if (this.element.hasAttribute("disabled")) {
      return
    }

    this.checkedValue = !this.checkedValue
    this.updateState(this.checkedValue, true)

    // Dispatch change event for forms
    this.element.dispatchEvent(new Event("change", { bubbles: true }))
  }

  handleKeydown(event) {
    // Support Space and Enter keys (Radix UI behavior)
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      this.toggle()
    }
  }

  updateState(isChecked, animate = true) {
    // Sync state on main element and thumb target
    const additionalTargets = this.hasThumbTarget ? [this.thumbTarget] : []
    syncCheckedState(this.element, isChecked, { additionalTargets })

    // Update hidden input if it exists (for form submission)
    const hiddenInput = this.element.querySelector('input[type="hidden"]')
    if (hiddenInput) {
      hiddenInput.value = isChecked ? "1" : "0"
    }
  }

  checkedValueChanged(value) {
    this.updateState(value, true)
  }
}
