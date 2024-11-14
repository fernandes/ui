import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["span"]

  handleToggle() {
    if(this.element.dataset.state == "checked") {
      this.element.setAttribute("aria-checked", "false")
      this.element.dataset.state = "unchecked"
      this.spanTarget.dataset.state = "unchecked"
      this.spanTarget.classList.add("hidden")
    } else {
      this.element.setAttribute("aria-checked", "true")
      this.element.dataset.state = "checked"
      this.spanTarget.dataset.state = "checked"
      this.spanTarget.classList.remove("hidden")
    }
  }
}
