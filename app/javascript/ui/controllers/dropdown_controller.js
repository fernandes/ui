import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]
  static classes = ["open"]

  connect() {
    console.log("Dropdown controller connected!", this.element)
    this.close()
  }

  toggle() {
    if (this.menuTarget.classList.contains(this.openClass)) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.menuTarget.classList.add(this.openClass)
    this.element.setAttribute("aria-expanded", "true")
  }

  close() {
    this.menuTarget.classList.remove(this.openClass)
    this.element.setAttribute("aria-expanded", "false")
  }

  // Close on outside click
  closeOnClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }
}
