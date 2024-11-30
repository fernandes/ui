import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["radio"]

  handleClick(e) {
    const target = e.target
    console.log("handleClick@dropdown-radio-group", target)
    this.radioTargets.forEach((x) => {
      this.uncheck(x)
    })
    this.check(target)
  }

  check(el) {
    el.setAttribute("aria-checked", "true")
    el.setAttribute("tabindex", "0")
    el.dataset.state = "checked"
    this.queryIcon(el).dataset.state = "checked"
  }

  uncheck(el) {
    el.setAttribute("aria-checked", "false")
    el.setAttribute("tabindex", "-1")
    el.dataset.state = "unchecked"
    this.queryIcon(el).dataset.state = "unchecked"
  }

  queryIcon(el) {
    return el.querySelector(":scope > span > span")
  }
}
