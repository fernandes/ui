import { Controller } from "@hotwired/stimulus"

// Command controller for command palette functionality
// Implements filtering, keyboard navigation, and item selection
export default class extends Controller {
  static targets = ["input", "list", "item", "group", "empty"]
  static values = {
    loop: { type: Boolean, default: true }
  }

  connect() {
    this.selectedIndex = -1
    this.updateVisibility()
  }

  filter() {
    const query = this.inputTarget.value.toLowerCase().trim()
    let hasVisibleItems = false

    this.itemTargets.forEach((item) => {
      const value = (item.dataset.value || item.textContent).toLowerCase()
      const matches = query === "" || value.includes(query)

      item.hidden = !matches
      if (matches) hasVisibleItems = true
    })

    // Show/hide groups based on whether they have visible items
    this.groupTargets.forEach((group) => {
      const items = group.querySelectorAll('[data-slot="command-item"]')
      const hasVisible = Array.from(items).some(item => !item.hidden)
      group.hidden = !hasVisible
    })

    // Show empty state if no matches
    if (this.hasEmptyTarget) {
      this.emptyTarget.classList.toggle("hidden", hasVisibleItems || query === "")
    }

    // Reset selection when filtering
    this.selectedIndex = -1
    this.updateSelection()
  }

  handleKeydown(event) {
    const visibleItems = this.visibleItems

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        this.selectNext(visibleItems)
        break
      case "ArrowUp":
        event.preventDefault()
        this.selectPrevious(visibleItems)
        break
      case "Enter":
        event.preventDefault()
        this.selectCurrent(visibleItems)
        break
      case "Home":
        event.preventDefault()
        this.selectFirst(visibleItems)
        break
      case "End":
        event.preventDefault()
        this.selectLast(visibleItems)
        break
    }
  }

  selectNext(items) {
    if (items.length === 0) return

    if (this.selectedIndex < items.length - 1) {
      this.selectedIndex++
    } else if (this.loopValue) {
      this.selectedIndex = 0
    }
    this.updateSelection()
  }

  selectPrevious(items) {
    if (items.length === 0) return

    if (this.selectedIndex > 0) {
      this.selectedIndex--
    } else if (this.loopValue) {
      this.selectedIndex = items.length - 1
    } else if (this.selectedIndex === -1) {
      this.selectedIndex = items.length - 1
    }
    this.updateSelection()
  }

  selectFirst(items) {
    if (items.length === 0) return
    this.selectedIndex = 0
    this.updateSelection()
  }

  selectLast(items) {
    if (items.length === 0) return
    this.selectedIndex = items.length - 1
    this.updateSelection()
  }

  selectCurrent(items) {
    if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
      const item = items[this.selectedIndex]
      if (!item.dataset.disabled) {
        this.triggerSelect(item)
      }
    }
  }

  select(event) {
    const item = event.currentTarget
    if (!item.dataset.disabled) {
      this.triggerSelect(item)
    }
  }

  triggerSelect(item) {
    const value = item.dataset.value || item.textContent.trim()

    this.element.dispatchEvent(new CustomEvent("command:select", {
      bubbles: true,
      detail: { value, item }
    }))

    // Also check for custom action on the item
    const onSelect = item.dataset.onSelect
    if (onSelect) {
      eval(onSelect)
    }
  }

  updateSelection() {
    const items = this.visibleItems

    items.forEach((item, index) => {
      const isSelected = index === this.selectedIndex
      item.dataset.selected = isSelected
      item.setAttribute("aria-selected", isSelected)

      if (isSelected) {
        item.scrollIntoView({ block: "nearest" })
        if (this.hasListTarget) {
          this.listTarget.setAttribute("aria-activedescendant", item.id || "")
        }
      }
    })
  }

  updateVisibility() {
    // Initial state - show all items, hide empty
    this.itemTargets.forEach(item => item.hidden = false)
    this.groupTargets.forEach(group => group.hidden = false)
    if (this.hasEmptyTarget) {
      this.emptyTarget.classList.add("hidden")
    }
  }

  get visibleItems() {
    return this.itemTargets.filter(item => !item.hidden && !item.dataset.disabled)
  }
}
