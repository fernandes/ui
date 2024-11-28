import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["trigger", "searchInput"]

  connect() {
    this.popoverOpen = false
  }

  handlePopoverOpen() {
    console.log("handlePopoverOpen@combobox")
    this.popoverOpen = true
    this.highlightSearchOrFirstItem()
  }

  highlightSearchOrFirstItem() {
    if(this.hasSearchInputTarget) {
      this.searchInputTarget.focus()
    } else {
      this.element.setAttribute("tabindex", 0)
      this.element.focus()
    }
  }

  handlePopoverClose() {
    this.popoverOpen = false
    if(this.hasTriggerTarget) {
      this.triggerTarget.focus({ focusVisible: true })
    }
  }

  handleEsc(e) {
    console.log("escinngngngngg", this.popoverOpen)
    // if(this.popoverOpen) {
    //   e.preventDefault()
    //   this.popoverOpen = false
    //   this.triggerTarget.focus()
    // }
    // console.log("escinngngngngg after", document.activeElement)
  }

  handleFocus() {
    console.log("handleFocus@comboboxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    this.highlightSearchOrFirstItem()
    this.element.setAttribute("tabindex", -1)
  }

  handleEnter() {
    if(!this.popoverOpen && document.activeElement == this.element) {
      console.log("open the gatesssssssssssss")
      this.openPopover()
    }
  }

  handleSpace() {
    // this.handleEnter() {
    // }
  }

  handleItemChecked(e) {
    console.log("handleItemChecked@combobox", e.target)
    const option = e.detail.el
    if(!this.hasTriggerTarget) return

    if(option.dataset.customIcon == "true") {
      const innerHTML = e.detail.el.innerHTML
      this.triggerTarget.innerHTML = innerHTML
      this.triggerTarget.classList.remove("justify-between")
    } else {
      const value = e.detail.value
      this.triggerTarget.innerText = value

    }
  }

  handleInputKeyLeft(e) {
    console.log("handleInputKeyLeft@combobox")
    e.stopPropagation()
  }

  handleInputKeyRight(e) {
    console.log("handleInputKeyRight@combobox")
    e.stopPropagation()
  }

  handleInputKeyDown() {

  }

  handleInputKeyUp() {

  }
}
