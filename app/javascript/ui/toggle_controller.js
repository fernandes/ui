import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  connect() {
  }

  handleClick(e) {
    this.toggle()
  }

  toggle() {
    const el = this.element
    const state = el.dataset.state
    if(state == "on") {
      el.dataset.state = "off"
      el.setAttribute("aria-pressed", "false")
    } else {
      el.dataset.state = "on"
      el.setAttribute("aria-pressed", "true")
    }
  }
}
