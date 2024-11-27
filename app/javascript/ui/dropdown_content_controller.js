import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["item"]

  connect() {
    console.log("contenttttttttttttttt", this.element.innerText)
  }

  handleKeyUp() {
    console.log("handleKeyUp@content", this.element.innerText)
    const highlighted = this.findHighlighted()
    let nextElement = undefined

    if(highlighted == undefined) {
      nextElement = this.itemTargets.at(-1)
    } else {
      const indexOf = this.itemTargets.indexOf(highlighted)
      nextElement = this.itemTargets[indexOf - 1]
    }
    
    if(nextElement) {
      this.deemphaziAllElements()
      this.highlightElement(nextElement)
    }
  }

  handleKeyDown() {
    console.log("handleKeyDown@content", this.element.innerText)
    const highlighted = this.findHighlighted()
    const indexOf = this.itemTargets.indexOf(highlighted)
    const nextElement = this.itemTargets[indexOf + 1]
    if(nextElement) {
      this.deemphaziAllElements()
      this.highlightElement(nextElement)
    }
  }

  handleKeyLeft() {
    console.log("handleKeyLeft@content", this.element.innerText)
    this.closeRequest()
  }

  handleKeyEsc() {
    console.log("handleKeyLeft@content", this.element.innerText)
    this.closeRequest()
  }

  closeRequest() {
    this.deemphaziAllElements()
    this.dispatch("closerequest")
  }

  handleFocus(e) {
    console.log("handleFocus@content", this.element.innerText, this.itemTargets.length)
    if(this.skipFirstHighlight) {
      this.skipFirstHighlight = false
      return true
    }
    if(this.itemTargets.length == 0) {
      console.log("focus on ", this.element.children[0])
      const child = this.element.children[0]
      child.setAttribute("tabindex", 0)
      return child.focus()
    }
    const highlighted = this.findHighlighted()
    if(highlighted) {
      this.highlightElement(highlighted)
    } else {
      this.highlightElement(this.itemTargets[0])
    }
  }

  handleContentClosed() {
    console.log("handleContentClosed@content", this.element.innerText)
    this.element.focus({focusVisible: true})
    this.handleFocus()
  }

  handleMouseEnterItem(e) {
    console.log("handleMouseEnterItem@content", e.target.innerText)
    this.deemphaziAllElements()
    this.highlightElement(e.target)
    this.dispatch("mouseenter")
  }

  handleMouseLeaveItem(e) {
    console.log("handleMouseLeaveItem@content", e.target.innerText)
    // this.deemphaziAllElements()
    // this.highlightElement(e.target)
    this.deemphaziElement(e.target)
    this.skipFirstHighlight = true
    this.element.focus()
    this.dispatch("mouseleave")
  }

  shutdown() {
    this.deemphaziAllElements()
  }

  findHighlighted() {
    return this.itemTargets.find((x) => {
      return x.dataset.highlighted == ""
    })
  }

  highlightElement(el) {
    console.log("highlighting", el.innerText)
    el.dataset.highlighted = ""
    el.setAttribute("tabindex", 0)
    el.focus({focusVisible: true})
  }

  deemphaziAllElements() {
    this.itemTargets.forEach((el) => {
      this.deemphaziElement(el)
    })
  }

  deemphaziElement(el) {
    el.dataset.highlighted = false
    el.setAttribute("tabindex", -1)
    const submenuController = this.application.getControllerForElementAndIdentifier(el, 'ui--dropdown-submenu')
    if(submenuController) {
      submenuController.handleElementDeemphazied()
    }
  }
}
