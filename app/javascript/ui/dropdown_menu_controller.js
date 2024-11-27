
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["item", "content"]

  handleKeyUp() {
    console.log("handleKeyUp@dropdown menu")
  }

  handleKeyDown() {
    console.log("handleKeyUp@dropdown menu")

  }

  handleEsc() {
    console.log("handleEsc@dropdown menu")
    this.shutdown()
    
  }

  shutdown() {
    const contents = this.element.querySelectorAll('[data-controller="ui--dropdown-content"]')
    contents.forEach((x) => {
      const contentController = this.application.getControllerForElementAndIdentifier(x, 'ui--dropdown-content')
      contentController.shutdown()
    })

    const submenus = this.element.querySelectorAll('[data-controller="ui--dropdown-submenu"]')
    submenus.forEach((x) => {
      const submenuController = this.application.getControllerForElementAndIdentifier(x, 'ui--dropdown-submenu')
      submenuController.shutdown()
    })
  }

  handlePopoverOpen() {
    console.log("handlePopoverOpened@dropdown menu")
    this.contentTarget.setAttribute("tabindex", 0)
    this.contentTarget.focus()
  }
  
  handlePopoverClose() {
    console.log("handlePopoverClosed@dropdown menu")

  }
  // connect() {
  //   this.stack = []
  // }
  //
  // pushContent(content) {
  //   console.log("pushing", content)
  //   this.stack.push(content)
  //   content.focus({focusVisible: true})
  //   console.log("current stack:", this.stack.length, this.stack)
  // }
  //
  // popContent() {
  //   const content = this.stack.pop()
  //   console.log("poping", content)
  //   console.log("current stack:", this.stack.length, this.stack)
  //   return content
  // }
  //
  // removeContent(content) {
  //   console.log("[stack] removing content", content)
  //   const index = this.stack.indexOf(content);
  //   if (index > -1) { // only splice array when item is found
  //     this.stack.splice(index, 1); // 2nd parameter means remove one item only
  //   }
  //   console.log("current stack:", this.stack.length, this.stack)
  // }
  //
  // stackFlush() {
  //   console.log("flushing")
  //   this.stack = []
  // }
  //
  // stackTop() {
  //   return this.stack.at(-1)
  // }
  //
  // handlePopoverOpen(e) {
  //   const popoverContent = e.detail.content
  //   const content = popoverContent.querySelector('[data-ui--dropdown-menu-target="content"')
  //   content.focus({focusVisible: true})
  //   console.log("handlePopoverOpen@dropdownmenu detail", content)
  //   this.removeAllHovers(content)
  //   this.highlightElement(content, "down")
  //   this.pushContent(popoverContent)
  // }
  //
  // handlePopoverClose(e) {
  //   const popoverContent = e.detail.content
  //   console.log("handlePopoverClose@dropdownmenu detail", popoverContent)
  //   this.removeContent(popoverContent)
  // }
  //
  // findElementContent(el) {
  //   const parent = el.parentElement
  //   if(parent.dataset["ui-DropdownMenuTarget"] == "content") {
  //     return parent
  //   } else {
  //     return this.findElementContent(parent)
  //   }
  // }
  //
  // findPopoverDropdownContent(el) {
  //   return el.querySelector('[data-ui--dropdown-menu-target="content"]')
  // }
  //
  // findPopoverContent(el) {
  //   const parent = el.parentElement
  //   if(parent.dataset["ui-PopoverTarget"] == "content") {
  //     return parent
  //   } else {
  //     return this.findPopoverContent(parent)
  //   }
  // }
  //
  // handleMouseEnter(e) {
  //   const el = e.target
  //   const content = this.findElementContent(el)
  //   this.mouseContent = content
  //   console.log("mouse entered", el, content)
  //   const items = this.childrenTargets(content)
  //   items.forEach((x) => {
  //     if(x.getAttribute("aria-haspopup") == "menu") {
  //       x.setAttribute("aria-expanded", "false")
  //     }
  //   })
  //   this.hover(el, content)
  //   if(el.getAttribute("aria-haspopup") == "menu") {
  //     el.setAttribute("aria-expanded", "true")
  //     console.log("expanding aria", el.getAttribute("aria-expanded"))
  //   }
  // }
  //
  // highlightElement(content, direction) {
  //   const items = this.childrenTargets(content)
  //   if(items.length == 0) {
  //     return true
  //   }
  //   items.forEach((x) => {
  //     if(x.getAttribute("aria-haspopup") == "menu") {
  //       x.setAttribute("aria-expanded", "false")
  //     }
  //   })
  //   const highlightedElement = this.highlightedElement(content)
  //   console.log("highlight Element : highlightedElement", highlightedElement)
  //   console.log("when highlighting check", items)
  //   if(highlightedElement) {
  //     const indexOf = items.indexOf(highlightedElement)
  //     let nextItem = undefined
  //     if(direction == "up") {
  //       nextItem = items[indexOf - 1]
  //     } else {
  //       nextItem = items[indexOf + 1]
  //     }
  //     if(nextItem) {
  //       this.hover(nextItem, content);
  //     }
  //   } else {
  //     if(items[0]) {
  //       this.hover(items[0], content)
  //     }
  //   }
  //   this.closeNestedPopovers(content)
  // }
  //
  // childrenTargets(content) {
  //   return Array.from(content.querySelectorAll(':scope > [data-ui--dropdown-menu-target="item"], :scope > [data-controller="ui--popover"] > [data-ui--popover-target="trigger"] > [data-ui--dropdown-menu-target="item"]'))
  // }
  //
  // highlightedElement(content) {
  //   const items = this.childrenTargets(content)
  //   console.log("items", items)
  //   return items.find((x) => {
  //     return x.dataset.highlighted == "true"
  //   })
  // }
  //
  // hover(el, content) {
  //   console.log("hover: ", el)
  //   this.removeAllHovers(content)
  //   el.setAttribute("tabindex", 0)
  //   el.dataset.highlighted = true
  //   el.focus({focusVisible: true})
  //   // when hovering we must not set aria expanded as true
  //   // console.log("hovering", el.getAttribute("aria-haspopup"))
  //   // if(el.getAttribute("aria-haspopup") == "menu") {
  //   //   el.setAttribute("aria-expanded", "true")
  //   //   console.log("expanding aria", el.getAttribute("aria-expanded"))
  //   // }
  // }
  //
  // removeAllHovers(content) {
  //   const itemsToRemove = this.childrenTargets(content)
  //   itemsToRemove.forEach((x) => {
  //     if(x.dataset.state == "open") {
  //       return true
  //     }
  //     x.setAttribute("tabindex", -1)
  //     x.dataset.highlighted = false
  //     // if(x.getAttribute("aria-haspopup") == "menu") {
  //     //   x.setAttribute("aria-expanded", "false")
  //     // }
  //   })
  // }
  //
  // handleKeyDown(e) {
  //   const el = e.target
  //   const content = this.findElementContent(el)
  //   this.highlightElement(content, "down")
  // }
  //
  // handleKeyUp(e) {
  //   const el = e.target
  //   console.log("key up for", el)
  //   const content = this.findElementContent(el)
  //   console.log("key up with content", content)
  //   this.highlightElement(content, "up")
  // }
  //
  // handleSubmenuKeyRight(e) {
  //   console.log("submenu key right")
  //   const el = e.target
  //   const event = new CustomEvent("requestopen", {
  //     view: window,
  //     bubbles: true,
  //     cancelable: true,
  //   });
  //   el.dispatchEvent(event)
  //   el.setAttribute("aria-expanded", "true")
  // }
  //
  // handleSubmenuKeyLeft(e) {
  //   const el = e.target
  //   const content = this.findElementContent(el)
  //   console.log("submenu key left", content)
  //   el.setAttribute("aria-expanded", "false")
  //   this.removeAllHovers(content)
  //   this.requestClosePopover(this.findElementContent(el))
  //   const levelUpContent = this.findElementContent(content)
  //   this.highlightPreviousMenu(levelUpContent)
  // }
  //
  // handleKeyLeft(e) {
  //   const el = e.target
  //   // const content = this.findElementContent(el)
  //   console.log("handle key left")
  //   const currentPopoverContent = this.popContent()
  //   const content = this.findPopoverDropdownContent(currentPopoverContent)
  //
  //   this.removeAllHovers(content)
  //   this.requestClosePopover(content)
  //   // this.requestClosePopover(content)
  //   // const levelUpContent = this.findElementContent(content)
  //   const topPopoverContent = this.findPopoverDropdownContent(this.stackTop())
  //   this.highlightPreviousMenu(topPopoverContent)
  // }
  //
  // highlightPreviousMenu(content) {
  //   const items = this.childrenTargets(content)
  //   this.closeNestedPopovers(content)
  //   
  //   const menuItem = items.find((x) => {
  //     if(x.getAttribute("aria-haspopup") == "menu" && x.getAttribute("aria-expanded") == "true") {
  //       return x
  //     }
  //
  //   })
  //   if(menuItem) {
  //     console.log("hover menu Item", menuItem)
  //     this.hover(menuItem, content)
  //   } else {
  //     console.log("highlight first")
  //     this.highlightElement(content, "down")
  //   }
  // }
  //
  // closeNestedPopovers(content) {
  //   content.querySelectorAll('[data-controller="ui--popover"]').forEach((x) => {
  //     const popoverController = this.application.getControllerForElementAndIdentifier(x, 'ui--popover')
  //     popoverController.setPopoverClose(true)
  //   })
  // }
  //
  // handleKeyRight(e) {
  //   
  // }
  //
  // requestClosePopover(el) {
  //   const event = new CustomEvent("requestclose", {
  //     bubbles: true,
  //     cancelable: false,
  //     detail: {
  //       trigger: el
  //     }
  //   });
  //   // const popover = this.element.querySelector(`[data-ui--popover-level-value="${level}"]`)
  //   // popover.dispatchEvent(event)
  //   el.dispatchEvent(event)
  // }
}
