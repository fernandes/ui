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
  static targets = [ "trigger", "content"]

  static values = {
    placement: { type: String, default: 'bottom' },
    openDelay: { type: Number, default: 10 },
    closeDelay: { type: Number, default: 10 },
    mouseout: { typer: String, default: 'keep' }
  }

  connect() {
    const button = this.triggerTarget
    const content = this.contentTarget
    const updatePosition = this.updatePosition.bind(this)
    useClickOutside(this)
    this.mouseOnContent = false
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

  openPopover() {
    clearTimeout(this.closeTimer);
    this.openTimer = window.setTimeout(() => this.setPopoverOpen(), this.openDelayValue);
  }

  setPopoverOpen() {
    this.dispatch(
      "ui:before-open",
      {
        target: this.contentTarget
      }
    )
    this.updatePosition(true)
    this.triggerTarget.dataset["state"] = "open"
    this.contentTarget.dataset["state"] = "open"
    this.contentTarget.style["display"] = "block"
    this.bodyOverflow = document.body.style["overflow-y"]
    document.body.style["overflow-y"] = "hidden"
    this.dispatch(
      "open",
      {
        target: this.contentTarget
      }
    )
  }

  closePopover() {
    clearTimeout(this.openTimer);
    if(!this.mouseOnContent) {
      this.closeTimer = window.setTimeout(() => this.setPopoverClose(), this.closeDelayValue);
    }
  }

  setPopoverClose() {
    if(this.mouseOnContent) {
      return true
    }
    this.triggerTarget.dataset["state"] = "closed"
    document.body.style["overflow-y"] = this.bodyOverflow
    this.closePopoverContent(this.contentTarget)
    this.closeNestedPopovers()
  }

  closeNestedPopovers() {
    this.contentTarget.querySelectorAll('[data-ui--popover-target="content"]').forEach((x) => {
      this.closePopoverContent(x)
    })
  }

  closePopoverContent(el) {
    el.style["display"] = "none"
    el.dataset.state = "closed"
    this.dispatch(
      "close",
      {
        target: el
      }
    )

  }

  isOpen() {
    return this.triggerTarget.dataset["state"] == "open"
  }

  updatePosition(force = false) {
    if(this.triggerTarget.dataset["state"] == "open" && !force) {
      return true
    }
    const rect = this.triggerTarget.getBoundingClientRect()
    const total = rect.top + rect.height + 4
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
            const options = elements.floating.querySelector(".ui-select2-options")
            // const body = elements.floating.querySelector(".ui-popover-content")
            if (availableHeight > window.innerHeight) {
              availableHeight = window.innerHeight
            }
            // Change styles, e.g.
            // Object.assign(elements.floating.style, {
            //   maxWidth: `${availableWidth}px`,
            //   maxHeight: `${availableHeight - 15}px`,
            //   // height: `${availableHeight - 15}px`,
            // });
            Object.assign(elements.floating.style, {
              maxWidth: `${availableWidth}px`,
              // maxHeight: `${Math.ceil(availableHeight)}px`,
              // height: `${availableHeight - 15}px`,
            });
            // Object.assign(body.style, {
            //   maxWidth: `${availableWidth}px`,
            //   maxHeight: `${availableHeight - 40}px`,
            //   // height: `${availableHeight - 15}px`,
            // });
          },
        })
      ]
    }).then(({x, y, placement, strategy, middlewareData}) => {
        console.log("here!")
      Object.assign(this.contentTarget.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }
}
