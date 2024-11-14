import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["trigger", "content", "item"]

  connect() {
    console.log(this.checkedItem())
    console.log(this.checkedValue())
    console.log(this.checkedLabel())
    this.state = "closed"

    if(this.checkedItem()) {
      this.triggerTarget.querySelector("span.span-label").innerText = this.checkedLabel();
    }
  }

  checkedItem() {
    return this.itemTargets.find((x) => (
      x.dataset.state == "checked"
    ))
  }

  checkedValue() {
    const checked = this.checkedItem()
    if(checked !== undefined) {
      return checked.getAttribute("value")
    }
  }

  checkedLabel() {
    const checked = this.checkedItem()
    if(checked !== undefined) {
      return checked.querySelector("span.span-label").innerText
    }
  }

  handlePopoverOpen() {
    this.state = "opened"

    const checked = this.checkedItem()
    this.cleanHovered()
    
    if(checked) {
      checked.scrollIntoView({block: "center", inline: "center"})
      checked.setAttribute("aria-selected", "true")
      checked.dataset.selected = "true"
    }
  }

  handlePopoverClose() {
    this.state = "closed"
    this.triggerTarget.focus()
  }

  cleanHovered() {
    this.itemTargets.forEach(x => {
      x.setAttribute("aria-selected", "false")
      x.dataset.selected = "false"
    })
  }

  handleChecked(e) {
    this.cleanChecked()
    this.checkItem(e.target)
  }

  cleanChecked() {
    this.itemTargets.forEach(x => {
      x.querySelector("span").classList.add("hidden")
      x.dataset.state = "unchecked"
    })
  }

  checkItem(item) {
    console.log('select', item)
    item.querySelector("span").classList.remove("hidden")
    item.dataset.state = "checked"

    this.triggerTarget.querySelector("span.span-label").innerText = this.checkedLabel();
  }

  hoveredItem() {
    return this.itemTargets.find((x) => (
      x.dataset.selected == "true"
    ))
  }

  hoverItem(item) {
    item.setAttribute("aria-selected", "true")
    item.dataset.selected = "true"
  }

  handleKeyUp(e) {
    if(this.state == "closed") {
      return true
    }
    const hovered = this.hoveredItem()
    if(hovered) {
      const hoveredIndex = this.itemTargets.findIndex((x) => (x == hovered))
      if(hoveredIndex > 0) {
        const target = this.itemTargets[hoveredIndex - 1]
        console.log('selecting!!', target)
        this.cleanHovered()
        this.hoverItem(target)
        target.scrollIntoView({block: "center", inline: "center"})
      }
    }
  }

  handleKeyDown(e) {
    if(this.state == "closed") {
      return true
    }
    const hovered = this.hoveredItem()
    let hoveredIndex
    if(hovered) {
      hoveredIndex = this.itemTargets.findIndex((x) => (x == hovered))
    } else {
      hoveredIndex = -1
    }

    if(hoveredIndex < (this.itemTargets.length - 1)) {
      const target = this.itemTargets[hoveredIndex + 1]
      console.log('selecting!!', target)
      this.cleanHovered()
      this.hoverItem(target)
      target.scrollIntoView({block: "center", inline: "center"})
    }
  }

  handleEnter(e) {
    if (this.state == "closed") {
      return true
    }
    const hovered = this.hoveredItem()
    this.cleanChecked()
    this.checkItem(hovered)
  }
} 
