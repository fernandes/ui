import { Controller } from '@hotwired/stimulus';
import {
  computePosition,
  offset,
  flip,
  shift,
  size,
  autoUpdate,
  platform
} from '@floating-ui/dom'

import {
  getComputedStyle,
  getContainingBlock,
  getNodeName,
  getWindow,
  isContainingBlock,
  isHTMLElement,
  isTableElement,
} from '@floating-ui/utils/dom';
import { useClickOutside } from "stimulus-use"

export default class extends Controller {
  static targets = ["content"]
  static values = {
    placement: { type: String, default: "right-start" },
    openDelay: { type: Number, default: 150 },
    closeDelay: { type: Number, default: 200 },
  }

  connect() {
    const updatePosition = this.updatePosition.bind(this)
    useClickOutside(this)
    this.element.dataset.state = "closed"
  }

  handleMouseEnter() {
    console.log("handleMouseLeave@dropdown submenu")
    this.openPopover({contentFocus: false})
  }

  handleMouseEnterContentItem() {
    this.openPopover({contentFocus: false})
  }

  handleEsc(e) {
    if(this.isOpen()) {
      // example to close a modal
      e.preventDefault()
      this.closePopover()
    }
  }

  handleSubmenuKeyRight() {
    this.setPopoverOpen({contentFocus: true})
  }

  handleSubmenuKeyUp() {
    console.log("handleSubmenuKeyUp@submenu", this.element.innerText)
  }

  handleSubmenuKeyDown() {
    console.log("handleSubmenuKeyDown@submenu", this.element.innerText)
  }

  handleContentCloseRequest(e) {
    console.log("handleContentCloseRequest@submenu")
    this.closePopover()
    this.dispatch("content-closed")
  }

  clickOutside(event) {
    if (this.isOpen()) {
      event.preventDefault()
      this.setPopoverClose()
    }
  }

  toggle() {
    if(this.isOpen()) {
      this.closePopover()
    } else {
      this.openPopover({contentFocus: false})
    }
  }

  openPopover(options) {
    clearTimeout(this.closeTimer);
    this.openTimer = window.setTimeout(() => this.setPopoverOpen(options), this.openDelayValue);
  }

  setPopoverOpen(options = {}) {
    console.log("setting popover open")
    this.element.dataset["state"] = "open"
    this.contentTarget.dataset["state"] = "open"
    this.contentTarget.setAttribute("tabindex", 0)
    // this.contentTarget.style["display"] = "block"
    if(options.contentFocus) {
      this.contentTarget.focus({focusVisible: true})
      this.contentTarget.focus
    }
    this.updatePosition(true)
    console.log("openedPopover : ", document.activeElement.innerText)
  }

  closePopover() {
    clearTimeout(this.openTimer);
    if(!this.mouseOnContent) {
      this.closeTimer = window.setTimeout(() => this.setPopoverClose(), this.closeDelayValue);
    }
  }

  setPopoverClose(force = false) {
    console.log('setPopoverClose')
    this.element.dataset["state"] = "closed"
    this.contentTarget.dataset["state"] = "closed"
    this.contentTarget.setAttribute("tabindex", -1)
    // this.contentTarget.style["display"] = "none"
  }

  shutdown() {
    this.setPopoverClose()
  }

  isOpen() {
    return this.element.dataset.state == "open"
  }


  handleElementDeemphazied() {
    if(this.element.dataset.state == "open") {
      this.closePopover()
    }
  }

  updatePosition(force = false) {
    const rect = this.element.getBoundingClientRect()
    const total = rect.top + rect.height + 4
    computePosition(this.element, this.contentTarget, {
      placement: this.placementValue,
      middleware: [
        offset(2),
      ]
    }).then(({x, y, placement, strategy, middlewareData}) => {
      Object.assign(this.contentTarget.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }
}
