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
      this.unpress(el)
    } else {
      this.press(el)
    }
  }

  press(el) {
    el.dataset.state = "on"
    el.setAttribute("aria-pressed", "true")
    this.dispatch("press")
  }

  unpress(el) {
    el.dataset.state = "off"
    el.setAttribute("aria-pressed", "false")
    this.dispatch("unpress")
  }
}
