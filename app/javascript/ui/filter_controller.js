import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ["item", "input"]
  connect() {
    this.clearFilter()
  }

  handlePopoverClose() {
    this.clearFilter()
  }

  handleInput(e) {
    const filterString = this.inputTarget.value
    if (typeof filterString === "string" && filterString.length === 0) {
      this.clearFilter()
    } else if (filterString === null) {
      this.clearFilter()
    } else {
      this.filterItems(filterString)
    }
  }

  filterItems(filterString) {
    const regex = new RegExp(`${filterString}`, "i");
    this.itemTargets.forEach((x) => {
      const searchTerm = x.dataset["ui-FilterSearchValue"]
      const found = searchTerm.match(regex);
      if(found) {
        x.classList.remove("hidden")
      } else {
        x.classList.add("hidden")
      }
    })
    this.dispatch("filtered", { detail: { string: filterString } })
  }

  clearFilter() {
    this.inputTarget.value = ""
    this.itemTargets.forEach((x) => {
      x.classList.remove("hidden")
    })
    this.dispatch("filtered", { detail: { string: "" } })
  }
}
