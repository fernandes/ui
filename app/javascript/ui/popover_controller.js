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
    placement: { type: String, default: 'bottom' }
  }

  connect() {
    const button = this.triggerTarget
    const content = this.contentTarget
    const updatePosition = this.updatePosition.bind(this)
    // this.updatePosition(true)
    // this.cleanup = autoUpdate(
    //   button,
    //   content,
    //   updatePosition,
    // );
    useClickOutside(this)
    console.log("placementValue", this.placementValue)
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
    this.dispatch(
      "ui:before-open",
      {
        target: this.contentTarget
      }
    )
    this.updatePosition(true)
    this.triggerTarget.dataset["state"] = "open"
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
    this.triggerTarget.dataset["state"] = "closed"
    this.contentTarget.style["display"] = "none"
    document.body.style["overflow-y"] = this.bodyOverflow
    this.dispatch(
      "close",
      {
        target: this.contentTarget
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
              maxHeight: `${availableHeight}px`,
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
