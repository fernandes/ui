import { Controller } from '@hotwired/stimulus';
import { useClickOutside } from "stimulus-use"

export default class extends Controller {
  static targets = ["dropdown", "trigger"]

  connect() {
    this.state = "closed"
  }

  handlePopoverOpen() {
    this.state = "open"
    const dropdownController = this.application.getControllerForElementAndIdentifier(
      this.dropdownTarget,
      'ui--dropdown-menu'
    )
    dropdownController.handlePopoverOpen()
  }

  handlePopoverClose() {
    this.state = "closed"
    console.log("handlePopoverClose@context-menu")
    this.triggerTarget.focus({focusVisible: true})
    
  }

  handleEsc() {
    console.log("handleEsc@context-menu")
    // this.shutdown()
    this.element.dispatchEvent(
      new CustomEvent("requestclose", {
        view: window,
        bubbles: true,
        cancelable: true,
        detail: {
          forceClose: true
        }
      })
    )
  }


  handleKeyDown(e) {
    // if(this.state == "closed") return

    if(e.shiftKey && e.code == "F10") {
      this.element.dispatchEvent(
        new CustomEvent("requestopen", {
          view: window,
          bubbles: true,
          cancelable: true,
          detail: {
            forceClose: true
          }
        })
      )
    }
  }
}
