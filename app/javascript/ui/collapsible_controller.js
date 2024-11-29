import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["trigger", "content"]

  handleClick(e) {
    console.log("handleClick collapsible")
    this.toggle()
  }

  toggle() {
    const el = this.element
    const trigger = this.triggerTarget
    const content = this.contentTarget

    if(this.isOpen()) {
      el.dataset.state = "closed"
      content.dataset.state = "closed"
      trigger.dataset.state = "closed"
      trigger.ariaExpanded = "false"
    } else {
      el.dataset.state = "open"
      content.dataset.state = "open"
      trigger.dataset.state = "open"
      trigger.ariaExpanded = "true"
    }
  }

  isOpen() {
    return this.element.dataset.state == "open"
  }
}
