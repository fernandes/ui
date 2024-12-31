import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["item"]
  static values = {
    search: { type: Boolean, default: false },
  }

  connect() {
    const checkedItem = this.checkedItem()
    if(checkedItem) {
      this.checkItem(checkedItem)
    }
  }

  handleFilterApplied() {
    this.unselectAllItems()
    this.selectItem(this.visibleItems()[0])
  }

  visibleItems() {
    return this.itemTargets.filter((x) => {
      return !x.classList.contains("hidden")
    })
  }

  handlePopoverOpen() {
    this.unselectAllItems()
    this.selectItem(this.itemTargets[0])
    if(!this.searchValue) {
      this.element.focus()
    }
  }

  handlePopoverClose() {
    this.unselectAllItems()
  }

  handleMouseEnter(e) {
    const target = e.target
    this.unselectAllItems()
    this.selectItem(e.target)
  }

  handleClick(e) {
    const target = e.target
    this.uncheckAllItems()
    this.checkItem(e.target)
  }

  handleUp(e) {
    this.goToElement("up")
  }

  handleDown(e) {
    this.goToElement("down")
  }

  handleEnter(e) {
    const selectedItem = this.selectedItem()
    if(selectedItem) {
      this.uncheckAllItems()
      this.checkItem(selectedItem)
    }
  }

  goToElement(direction) {
    const availableItems = this.visibleItems()
    const selectedItem = this.selectedItem()
    if(selectedItem == undefined) {
      this.selectItem(availableItems[0])
    } else {
      const currentPosition = availableItems.indexOf(selectedItem)

      // next element according with direction
      let nextElement = undefined
      if (direction == "up") {
        nextElement = availableItems[currentPosition - 1]
      } else {
        nextElement = availableItems[currentPosition + 1]
      }

      if(nextElement) {
        this.unselectAllItems()
        this.selectItem(nextElement)
      }
    }

  }

  uncheckAllItems() {
    this.itemTargets.forEach((x) => {
      this.uncheckItem(x)
    })
  }

  unselectAllItems() {
    this.itemTargets.forEach((x) => {
      this.unselectItem(x)
    })
  }

  checkedItem() {
    return this.itemTargets.find((x) => (
      x.dataset.checked == "true"
    ))
  }

  selectedItem() {
    return this.itemTargets.find((x) => (
      x.dataset.selected == "true"
    ))
  }

  checkItem(item) {
    this.dispatch("checked", { detail: { value: item.innerText, el: item } })
    item.dataset.checked = "true"
    item.setAttribute("aria-checked", "true")
    this.checkIcon(item)
  }

  checkIcon(item) {
    const icon = item.querySelector("svg")
    const uncheckedClass = icon.dataset.uncheckedClass
    icon.classList.add("opacity-100")
    icon.classList.remove(uncheckedClass)
  }

  uncheckItem(item) {
    this.dispatch("unchecked", { detail: { value: item.innerText } })
    item.dataset.checked = "false"
    item.setAttribute("aria-checked", "false")
    this.uncheckIcon(item)
  }

  uncheckIcon(item) {
    const icon = item.querySelector("svg")
    const uncheckedClass = icon.dataset.uncheckedClass
    icon.classList.remove("opacity-100")
    icon.classList.add(uncheckedClass)
  }

  selectItem(item) {
    if(item == undefined) {
      return false
    }
    this.dispatch("selected", { default: {value: item.innerText }})
    item.dataset.selected = "true"
    item.setAttribute("aria-selected", "true")
    item.scrollIntoView({block: "center", inline: "center"})
  }

  unselectItem(item) {
    this.dispatch("unselected", item)
    item.dataset.selected = "false"
    item.setAttribute("aria-selected", "false")
  }

  dispatchEvent(event, target) {
    this.dispatch(event, {target: target})
  }
}
