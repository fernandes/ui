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
  static targets = [ "trigger", "content", "receiver"]

  static values = {
    placement: { type: String, default: 'bottom' },
    openDelay: { type: Number, default: 10 },
    closeDelay: { type: Number, default: 10 },
    mouseout: { typer: String, default: 'keep' },
    level: { type: Number, default: 0 }
  }

  connect() {
    const updatePosition = this.updatePosition.bind(this)
    useClickOutside(this)
    this.mouseOnContent = false
    this.element.dataset.state = "closed"
  }

  handleMouseenterContent() {
    this.mouseOnContent = true
  }

  handleMouseleaveContent() {
    this.mouseOnContent = false
    if(this.mouseoutValue == "close") {
      this.closePopover()
    } 
  }

  handleWindowResize() {
    if(!this.isOpen()) return

    if(this.placementValue == "cursor") {
      this.closePopover()
    } else {
      this.updatePosition(true)
    }
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
      // example to close a modal
      event.preventDefault()
      this.closePopover()
    }
  }

  toggle() {
    if(this.isOpen()) {
      this.closePopover()
    } else {
      this.openPopover()
    }
  }

  openPopover(e) {
    if(this.placementValue == "cursor") {
      this.mouseX = e.pageX + 1
      this.mouseY = e.pageY + 1
    }
    clearTimeout(this.closeTimer);
    this.openTimer = window.setTimeout(() => this.setPopoverOpen(), this.openDelayValue);
  }

  setPopoverOpen() {
    const eventDetails = {
      detail: {
        content: this.contentTarget,
        trigger: this.triggerTarget,
        level: this.levelValue
      }
    }
    this.dispatch("ui:before-open", eventDetails)
    this.receiverTargets.forEach((x) => {
      x.dispatchEvent(
        new CustomEvent("ui--popover:before-open", eventDetails)
      )
    })
    if(this.placementValue == "cursor") {
      Object.assign(this.contentTarget.style, {
        left: `${this.mouseX}px`,
        top: `${this.mouseY}px`,
      });
    } else {
      this.updatePosition(true)
    }
    this.triggerTarget.dataset["state"] = "open"
    this.element.dataset["state"] = "open"
    this.contentTarget.dataset["state"] = "open"
    this.contentTarget.style["display"] = "block"
    this.contentTarget.focus({focusVisible: true})
    this.bodyOverflow = document.body.style["overflow-y"]
    document.body.style["overflow-y"] = "hidden"
    this.dispatch( "open", eventDetails )
    this.checkArrows()
    this.receiverTargets.forEach((x) => {
      console.log("receivers", x)
      x.dispatchEvent(
        new CustomEvent("ui--popover:open", eventDetails)
      )
    })
  }

  checkArrows() {
    const scrollsController = this.application.getControllerForElementAndIdentifier(this.contentTarget, 'ui--scroll-buttons')
    if(scrollsController) {
      scrollsController.checkArrows()
    }
  }

  closePopover() {
    clearTimeout(this.openTimer);
    if(!this.mouseOnContent) {
      this.closeTimer = window.setTimeout(() => this.setPopoverClose(), this.closeDelayValue);
    }
  }

  setPopoverClose(force = false) {
    if(this.mouseOnContent && !force) {
      return true
    }
    this.mouseOnContent = false
    if(this.hasTriggerTarget) {
      this.triggerTarget.dataset["state"] = "closed"
    }
    this.element.dataset["state"] = "closed"
    document.body.style["overflow-y"] = this.bodyOverflow
    if(this.hasContentTarget) {
      this.closePopoverContent(this.contentTarget)
      this.closeNestedPopovers()
    }
  }

  closeNestedPopovers() {
    if(this.hasContentTarget) {
      this.contentTarget.querySelectorAll('[data-ui--popover-target="content"]').forEach((x) => {
        this.closePopoverContent(x)
      })
    }
  }

  handleRequestClose(e) {
    console.log("[popover] requested to close..", e)
    const forceClose = e.detail.forceClose == true
    console.log("should I force?", forceClose)
    // if(e.detail.level == this.levelValue) {
      this.setPopoverClose(forceClose)
    // }
  }

  closePopoverContent(el, via = "mouse") {
    el.style["display"] = "none"
    el.dataset.state = "closed"
    const eventDetails = {
      detail: {
        content: this.contentTarget,
        trigger: this.triggerTarget,
        level: this.levelValue
      }
    }
    this.dispatch("close", eventDetails)
    this.receiverTargets.forEach((x) => {
      x.dispatchEvent(
        new CustomEvent("ui--popover:close", eventDetails)
      )
    })
  }

  isOpen() {
    return this.element.dataset.state == "open"
  }

  updatePosition(force = false) {
    if(this.triggerTarget.dataset["state"] == "open" && !force) {
      return true
    }
    computePosition(this.triggerTarget, this.contentTarget, {
      placement: this.placementValue,
      middleware: [
        offset(4),
        flip(),
        shift({padding: 5}),
        size({
          apply({availableWidth, availableHeight, elements, ...state}) {
            // then we let flip set the position
            if(availableHeight < 200) {
              return
            }
            if (availableHeight > window.innerHeight) {
              availableHeight = window.innerHeight
            }
            Object.assign(elements.floating.style, {
              maxWidth: `${availableWidth}px`,
            });
          },
        })
      ]
    }).then(({x, y, placement, strategy, middlewareData}) => {
      Object.assign(this.contentTarget.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }
}
