import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  connect() {
  }

  handleMouseover() {
    this.dispatch("mouseover")
    this.hoverItem()
  }

  handleMouseout() {
    this.leaveItem()
  }

  handleClick(e) {
    this.dispatch("checked", {target: e.currentTarget})
  }

  hoverItem() {
    this.element.setAttribute("aria-selected", "true")
    this.element.dataset.selected = "true"
  }

  leaveItem() {
    this.element.setAttribute("aria-selected", "false")
    this.element.dataset.selected = "false"
  }
}
