import { Controller } from "@hotwired/stimulus"
import { syncCheckedState } from "../utils/state-manager.js"

// Checkbox controller - syncs checked state with data-state attribute
// This allows CSS selectors like data-[state=checked]:bg-blue-600 to work
export default class extends Controller {
  connect() {
    this.updateState()

    // Listen for changes to update data-state
    this.boundHandleChange = this.handleChange.bind(this)
    this.element.addEventListener('change', this.boundHandleChange)
  }

  disconnect() {
    this.element.removeEventListener('change', this.boundHandleChange)
  }

  handleChange() {
    this.updateState()
  }

  updateState() {
    // Sync checked state with data-state and aria-checked attributes
    syncCheckedState(this.element, this.element.checked)
  }
}
