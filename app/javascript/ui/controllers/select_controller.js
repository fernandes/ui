import { Controller } from "@hotwired/stimulus"
import { computePosition, flip, shift, offset, size } from "@floating-ui/dom"

// Connects to data-controller="ui--select"
export default class extends Controller {
  static targets = [
    "trigger",
    "content",
    "item",
    "valueDisplay",
    "hiddenInput",
    "scrollUpButton",
    "scrollDownButton",
    "viewport",
    "itemCheck"
  ]

  static values = {
    value: String,
    open: { type: Boolean, default: false }
  }

  constructor() {
    super(...arguments)
    this.scrollInterval = null
    this.boundHandleClickOutside = null
  }

  connect() {
    // Initialize selected state
    if (this.valueValue) {
      this.updateDisplay(this.valueValue)
      this.updateSelection(this.valueValue)
    }

    // Hide content initially using invisible pattern (not display:none)
    this.contentTarget.dataset.state = "closed"

    // Setup keyboard navigation
    this.boundHandleKeydown = this.handleKeydown.bind(this)

    // Setup scroll handler
    this.boundHandleScroll = this.handleScroll.bind(this)
    if (this.hasViewportTarget) {
      // Listen to scroll event (works for both mouse wheel and touch scroll)
      // Adding both via addEventListener AND data-action for maximum compatibility
      this.viewportTarget.addEventListener("scroll", this.boundHandleScroll, { passive: true })
    }
  }

  toggle(event) {
    event?.preventDefault()

    if (this.openValue) {
      this.close()
    } else {
      this.open()
    }
  }

  async open() {
    this.openValue = true
    this.contentTarget.dataset.state = "open"
    this.triggerTarget.setAttribute("aria-expanded", "true")

    // Position using Floating UI and set CSS variables
    await this.updatePosition()

    // Setup click outside
    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    setTimeout(() => {
      document.addEventListener("click", this.boundHandleClickOutside)
      document.addEventListener("keydown", this.boundHandleKeydown)
    }, 0)

    // Check scroll button visibility after content is fully rendered
    // Use setTimeout to ensure the browser has painted the layout
    setTimeout(() => {
      this.handleScroll()
    }, 50)

    // Focus first selected item or first item
    this.focusItem(this.getSelectedItem() || this.getFirstItem())
  }

  close() {
    this.openValue = false
    this.contentTarget.dataset.state = "closed"
    this.triggerTarget.setAttribute("aria-expanded", "false")

    if (this.boundHandleClickOutside) {
      document.removeEventListener("click", this.boundHandleClickOutside)
      document.removeEventListener("keydown", this.boundHandleKeydown)
      this.boundHandleClickOutside = null
    }

    // Return focus to trigger
    this.triggerTarget.focus()
  }

  async updatePosition() {
    const maxHeight = 384 // Max height similar to max-h-96 (24rem = 384px)

    const { x, y, middlewareData, placement } = await computePosition(this.triggerTarget, this.contentTarget, {
      placement: "bottom-start",
      middleware: [
        offset(4),
        flip(),
        shift({ padding: 8 }),
        size({
          apply({ availableHeight, availableWidth, elements, rects }) {
            // Limit to maxHeight to ensure scrolling
            const contentHeight = Math.min(maxHeight, Math.max(200, availableHeight - 16))

            // Set max-height on content - this prevents it from growing too large
            elements.floating.style.maxHeight = `${contentHeight}px`

            // Set CSS variables for Radix-style positioning (using --ui-select-* prefix)
            elements.floating.style.setProperty("--ui-select-content-available-width", `${availableWidth}px`)
            elements.floating.style.setProperty("--ui-select-content-available-height", `${contentHeight}px`)
            elements.floating.style.setProperty("--ui-select-trigger-width", `${rects.reference.width}px`)
            elements.floating.style.setProperty("--ui-select-trigger-height", `${rects.reference.height}px`)
          }
        })
      ]
    })

    Object.assign(this.contentTarget.style, {
      left: `${x}px`,
      top: `${y}px`,
      position: "absolute"
    })

    // Set data-side attribute for positioning-dependent styling
    const side = placement.split("-")[0]
    this.contentTarget.dataset.side = side
  }

  selectItem(event) {
    if (!event || !event.currentTarget) return

    const item = event.currentTarget
    const value = item.dataset.value

    if (item.dataset.disabled === "true") return

    this.valueValue = value
    this.updateDisplay(value)
    this.updateSelection(value)

    if (this.hasHiddenInputTarget) {
      this.hiddenInputTarget.value = value

      // Dispatch change event for form handling
      this.hiddenInputTarget.dispatchEvent(new Event("change", { bubbles: true }))
    }

    this.close()
  }

  updateDisplay(value) {
    const selectedItem = this.itemTargets.find(item => item.dataset.value === value)
    if (selectedItem && this.hasValueDisplayTarget) {
      // Get the text content, excluding the checkmark icon
      const span = selectedItem.querySelector("span:first-child")
      this.valueDisplayTarget.textContent = span ? span.textContent.trim() : selectedItem.textContent.trim()
    }
  }

  updateSelection(value) {
    this.itemTargets.forEach((item, index) => {
      const isSelected = item.dataset.value === value
      item.setAttribute("aria-selected", isSelected)
      item.dataset.state = isSelected ? "checked" : "unchecked"

      // Update checkmark visibility
      const checks = item.querySelectorAll('[data-ui--select-target="itemCheck"]')
      checks.forEach(check => {
        if (isSelected) {
          check.classList.remove("opacity-0")
          check.classList.add("opacity-100")
        } else {
          check.classList.remove("opacity-100")
          check.classList.add("opacity-0")
        }
      })

      // Remove focus class from all items
      item.classList.remove("bg-accent", "text-accent-foreground")
    })
  }

  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  // Keyboard navigation
  handleKeydown(event) {
    if (!this.openValue) return

    const currentItem = this.getFocusedItem()

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        this.focusNextItem(currentItem)
        break
      case "ArrowUp":
        event.preventDefault()
        this.focusPreviousItem(currentItem)
        break
      case "Enter":
      case " ":
        event.preventDefault()
        if (currentItem) {
          currentItem.click()
        }
        break
      case "Escape":
        event.preventDefault()
        this.close()
        break
      case "Home":
        event.preventDefault()
        this.focusItem(this.getFirstItem())
        break
      case "End":
        event.preventDefault()
        this.focusItem(this.getLastItem())
        break
    }
  }

  getFocusedItem() {
    return this.itemTargets.find(item =>
      item.classList.contains("bg-accent") ||
      item.classList.contains("text-accent-foreground")
    )
  }

  getSelectedItem() {
    return this.itemTargets.find(item => item.getAttribute("aria-selected") === "true")
  }

  getFirstItem() {
    return this.getEnabledItems()[0]
  }

  getLastItem() {
    const items = this.getEnabledItems()
    return items[items.length - 1]
  }

  getEnabledItems() {
    return this.itemTargets.filter(item => item.dataset.disabled !== "true")
  }

  focusItem(item, scrollDirection = null) {
    if (!item) return

    // Remove focus from all items
    this.itemTargets.forEach(i => {
      i.classList.remove("bg-accent", "text-accent-foreground")
      delete i.dataset.highlighted
    })

    // Add focus to target item
    item.classList.add("bg-accent", "text-accent-foreground")
    item.dataset.highlighted = "true"

    // Check if this is first or last item
    const items = this.getEnabledItems()
    const isFirstItem = item === items[0]
    const isLastItem = item === items[items.length - 1]

    // Handle scroll button visibility for first/last items
    if (isFirstItem && this.hasScrollUpButtonTarget) {
      this.scrollUpButtonTarget.style.display = "none"
    }

    if (isLastItem && this.hasScrollDownButtonTarget) {
      this.scrollDownButtonTarget.style.display = "none"
    }

    // Position item based on scroll direction
    if (scrollDirection === "down" && !isLastItem) {
      // Position item 24px from bottom of viewport (above scroll button)
      if (this.hasViewportTarget) {
        const viewport = this.viewportTarget
        const itemRect = item.getBoundingClientRect()
        const viewportRect = viewport.getBoundingClientRect()
        const targetBottom = viewportRect.bottom - 24

        if (itemRect.bottom > targetBottom) {
          const scrollAmount = itemRect.bottom - targetBottom
          viewport.scrollTop += scrollAmount
        }
      }
    } else if (scrollDirection === "up" && !isFirstItem) {
      // Position item 24px from top of viewport (below scroll button)
      if (this.hasViewportTarget) {
        const viewport = this.viewportTarget
        const itemRect = item.getBoundingClientRect()
        const viewportRect = viewport.getBoundingClientRect()
        const targetTop = viewportRect.top + 24

        if (itemRect.top < targetTop) {
          const scrollAmount = targetTop - itemRect.top
          viewport.scrollTop -= scrollAmount
        }
      }
    } else {
      // Default behavior for first/last items or no direction
      item.scrollIntoView({ block: "nearest", behavior: "auto" })
    }
  }

  focusNextItem(currentItem) {
    const items = this.getEnabledItems()
    if (items.length === 0) return

    if (!currentItem) {
      this.focusItem(items[0], "down")
      return
    }

    const currentIndex = items.indexOf(currentItem)
    // Stop at last item instead of wrapping around
    if (currentIndex >= items.length - 1) {
      return // Already at last item, don't move
    }

    const nextIndex = currentIndex + 1
    this.focusItem(items[nextIndex], "down")
  }

  focusPreviousItem(currentItem) {
    const items = this.getEnabledItems()
    if (items.length === 0) return

    if (!currentItem) {
      this.focusItem(items[items.length - 1], "up")
      return
    }

    const currentIndex = items.indexOf(currentItem)
    // Stop at first item instead of wrapping around
    if (currentIndex <= 0) {
      return // Already at first item, don't move
    }

    const previousIndex = currentIndex - 1
    this.focusItem(items[previousIndex], "up")
  }

  // Scroll handling for scroll buttons
  scrollUp() {
    if (!this.scrollInterval) {
      this.scrollInterval = setInterval(() => {
        if (this.hasViewportTarget) {
          this.viewportTarget.scrollTop -= 5
        }
      }, 16) // ~60fps
    }
  }

  scrollDown() {
    if (!this.scrollInterval) {
      this.scrollInterval = setInterval(() => {
        if (this.hasViewportTarget) {
          this.viewportTarget.scrollTop += 5
        }
      }, 16) // ~60fps
    }
  }

  stopScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval)
      this.scrollInterval = null
    }
  }

  handleScroll() {
    if (!this.hasViewportTarget) return

    const viewport = this.viewportTarget
    const isNearTop = viewport.scrollTop <= 0

    // Use Math.ceil for scroll bottom detection (Radix pattern for zoom scenarios)
    const maxScroll = viewport.scrollHeight - viewport.clientHeight
    const isAtBottom = Math.ceil(viewport.scrollTop) >= maxScroll

    // Check if first or last item is focused
    const focusedItem = this.getFocusedItem()
    const items = this.getEnabledItems()
    const isFirstItemFocused = focusedItem === items[0]
    const isLastItemFocused = focusedItem === items[items.length - 1]

    if (this.hasScrollUpButtonTarget) {
      // Show scroll up button when can scroll up (Radix pattern)
      const canScrollUp = viewport.scrollTop > 0
      this.scrollUpButtonTarget.style.display = canScrollUp ? "flex" : "none"
    }

    if (this.hasScrollDownButtonTarget) {
      // Hide scroll down button if at bottom OR if last item is focused
      this.scrollDownButtonTarget.style.display = (isAtBottom || isLastItemFocused) ? "none" : "flex"
    }
  }

  // Mouse hover handling
  handleItemMouseEnter(event) {
    if (!this.openValue) return

    const item = event.currentTarget
    if (item.dataset.disabled === "true") return

    this.focusItem(item)
  }

  handleItemMouseLeave(event) {
    // Optional: could remove focus on mouse leave if desired
    // For now, we keep the item focused even after mouse leaves
  }

  disconnect() {
    this.stopScroll()
    if (this.boundHandleClickOutside) {
      document.removeEventListener("click", this.boundHandleClickOutside)
      document.removeEventListener("keydown", this.boundHandleKeydown)
    }
    if (this.boundHandleScroll && this.hasViewportTarget) {
      this.viewportTarget.removeEventListener("scroll", this.boundHandleScroll)
    }
  }
}
