import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["image", "fallback"]

  connect() {
    const data_src = this.imageTarget.getAttribute("data-src")
    this.imageTarget.setAttribute("src", data_src)
  }

  handleError(e) {
    this.imageTarget.classList.add("hidden")
    this.fallbackTarget.classList.remove("hidden")
  }

  handleLoad(e) {
    this.imageTarget.classList.remove("hidden")
    this.fallbackTarget.classList.add("hidden")
  }
}
