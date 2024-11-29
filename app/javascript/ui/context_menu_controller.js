import { Controller } from '@hotwired/stimulus';
import { useClickOutside } from "stimulus-use"

export default class extends Controller {
  static targets = ["content", "trigger"]

  static values = {
    placement: { type: String, default: "right-start" },
    openDelay: { type: Number, default: 150 },
    closeDelay: { type: Number, default: 200 },
  }

  connect() {
    useClickOutside(this)
    this.element.dataset.state = "closed"
  }

  handleContextMenu(e) {
    console.log("handleContextMenu@context-menu", e) 
    // this.openPopover({contentFocus: true})
    const x = e.pageX + 1
    const y = e.pageY + 1
    Object.assign(this.contentTarget.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
    this.element.dataset["state"] = "open"
    this.contentTarget.dataset["state"] = "open"
    // this.contentTarget.setAttribute("tabindex", 0)
    // this.contentTarget.focus
    console.log("openedPopover : ", document.activeElement.innerText)
  }

  handleEsc(e) {
    if(this.isOpen()) {
      // example to close a modal
      e.preventDefault()
      this.closePopover()
    }
  }

  clickOutside(event) {
    if (this.isOpen()) {
      event.preventDefault()
      this.closePopover()
    }
  }

  closePopover() {
    console.log('setPopoverClose')
    this.element.dataset["state"] = "closed"
    this.contentTarget.dataset["state"] = "closed"
    this.contentTarget.setAttribute("tabindex", -1)
  }

  isOpen() {
    return this.element.dataset.state == "open"
  }
}
