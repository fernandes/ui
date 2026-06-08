import { Controller } from "@hotwired/stimulus"

// Command controller for command palette functionality
// Implements filtering, keyboard navigation, and item selection
export default class extends Controller {
  static targets = ["input", "list", "item", "group", "empty"]
  static values = {
    loop: { type: Boolean, default: true },
    autofocus: { type: Boolean, default: false }
  }

  connect() {
    this.selectedIndex = -1
    this.updateVisibility()

    // Listen at the document level because popover:show / drawer:show are
    // dispatched on the popover/drawer root — an ANCESTOR of this Command.
    // Events bubble up, so a direct listener on `this.element` never fires.
    // We filter by checking whether the dispatcher contains us.
    //
    // Also: bind once and store the references so removeEventListener
    // actually matches in disconnect.
    this._boundHandleShow = (event) => {
      if (event.target.contains(this.element)) this.handleShow()
    }
    this._boundHandleHide = (event) => {
      if (event.target.contains(this.element)) this.handleHide()
    }
    document.addEventListener("popover:show", this._boundHandleShow)
    document.addEventListener("drawer:show",  this._boundHandleShow)
    document.addEventListener("popover:hide", this._boundHandleHide)
    document.addEventListener("drawer:hide",  this._boundHandleHide)
  }

  disconnect() {
    document.removeEventListener("popover:show", this._boundHandleShow)
    document.removeEventListener("drawer:show",  this._boundHandleShow)
    document.removeEventListener("popover:hide", this._boundHandleHide)
    document.removeEventListener("drawer:hide",  this._boundHandleHide)
  }

  handleShow() {
    // Focus the input when popover/drawer opens (only if autofocus is enabled)
    if (this.autofocusValue && this.hasInputTarget) {
      this.inputTarget.focus()
    }

    // Select first visible item
    const visibleItems = this.visibleItems
    if (visibleItems.length > 0) {
      this.selectedIndex = 0
      this.updateSelection()
    }
  }

  // Reset filter when popover/drawer closes so the next open shows everything.
  // Sem isso, o usuário fecha com "role" digitado e na próxima vez só vê o
  // que casa com "role" — UX confusa.
  handleHide() {
    if (this.hasInputTarget && this.inputTarget.value !== "") {
      this.inputTarget.value = ""
      this.filter()
    }
    this.selectedIndex = -1
    this.updateSelection()
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

    // Auto-select first visible item ao digitar — assim Enter ativa direto.
    // Quando query é vazio, mantém sem seleção (estado neutro).
    const visibleItems = this.visibleItems
    if (query !== "" && visibleItems.length > 0) {
      this.selectedIndex = 0
    } else {
      this.selectedIndex = -1
    }
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

    // Dispatch event for listeners to handle selection
    this.element.dispatchEvent(new CustomEvent("command:select", {
      bubbles: true,
      detail: { value, item }
    }))

    // If item has an href, navigate to it
    const href = item.dataset.href
    if (href) {
      if (item.dataset.turbo === "false") {
        window.location.href = href
      } else {
        Turbo.visit(href)
      }
    }

    // If item has a Stimulus action defined, it will be triggered automatically
    // via data-action attribute on the item element
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
