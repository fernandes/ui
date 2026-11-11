import { Controller } from "@hotwired/stimulus"

// Checkbox controller - mirrors the native checkbox state on `data-state`
// ("checked" / "unchecked" / "indeterminate") for styling.
//
// The element is a native <input type="checkbox">, so the browser already
// exposes checked / unchecked / mixed to assistive technology; no aria-checked
// is set (it would go stale after a form reset).
//
// "Mixed" has no HTML attribute: the markup carries `data-indeterminate="true"`
// and this controller sets the `indeterminate` property from it. A click clears
// it (native behavior); a form reset restores the rendered state.
export default class extends Controller {
  constructor() {
    super(...arguments)
  }

  connect() {
    this.initialIndeterminate = this.element.dataset.indeterminate === "true"
    if (this.initialIndeterminate) this.element.indeterminate = true
    this.updateState()

    this.handleChange = this.handleChange.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.element.addEventListener("change", this.handleChange)
    this.form = this.element.form
    if (this.form) this.form.addEventListener("reset", this.handleReset)
  }

  disconnect() {
    this.element.removeEventListener("change", this.handleChange)
    if (this.form) this.form.removeEventListener("reset", this.handleReset)
    this.form = null
  }

  handleChange() {
    this.updateState()
  }

  // `reset` fires before the browser restores the controls, so sync afterwards.
  handleReset() {
    setTimeout(() => {
      this.element.indeterminate = this.initialIndeterminate
      this.updateState()
    }, 0)
  }

  updateState() {
    const state = this.element.indeterminate
      ? "indeterminate"
      : (this.element.checked ? "checked" : "unchecked")
    this.element.setAttribute("data-state", state)
    // Older markup rendered aria-checked; drop it so it can't go stale.
    this.element.removeAttribute("aria-checked")
  }
}
