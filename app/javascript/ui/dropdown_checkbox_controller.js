import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["icon"]

  handleClick() {
    console.log("handleClick@dropdown-checkbox")
    if(this.isChecked()) {
      this.uncheck()
    } else {
      this.check()
    }
  }

  check() {
    const el = this.element
    el.setAttribute("aria-checked", "true")
    el.dataset.state = "checked"
    this.iconTarget.dataset.state = "checked"
  }

  uncheck() {
    const el = this.element
    el.setAttribute("aria-checked", "false")
    el.dataset.state = "unchecked"
    this.iconTarget.dataset.state = "unchecked"
  }

  isChecked() {
    return this.element.dataset.state == "checked"
  }
}
