import { Controller } from "@hotwired/stimulus"
import { computePosition, flip, offset, shift } from "@floating-ui/dom"

// Context Menu controller - triggered by right-click with keyboard navigation support
// Based on dropdown_controller but with contextmenu trigger instead of click
export default class extends Controller {
  static targets = ["trigger", "content", "item"]
  static values = {
    open: { type: Boolean, default: false }
  }

  constructor() {
    super(...arguments)
    this.lastHoveredItem = null
  }

  connect() {
    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    document.addEventListener('click', this.boundHandleClickOutside)
  }

  disconnect() {
    document.removeEventListener('click', this.boundHandleClickOutside)
    document.removeEventListener('keydown', this.boundHandleKeydown)
  }

  // Handle right-click to open context menu
  open(event) {
    event.preventDefault() // Prevent default browser context menu
    event.stopPropagation()

    // Close any other open context menus first
    this.closeAllContextMenus()

    this.openValue = true
    const content = this.contentTarget

    // Show the menu
    content.classList.remove('hidden')
    content.setAttribute('data-state', 'open')

    // Position menu at cursor location
    this.positionContextMenu(event.clientX, event.clientY)

    // Setup keyboard navigation
    this.setupKeyboardNavigation()

    // Focus first item after a short delay
    setTimeout(() => {
      this.focusItem(0)
    }, 100)
  }

  close() {
    this.openValue = false
    const content = this.contentTarget

    if (content) {
      content.classList.add('hidden')
      content.setAttribute('data-state', 'closed')
    }

    // Clear keyboard focus from all items
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
    allMenuItems.forEach(item => {
      item.setAttribute('tabindex', '-1')
    })

    this.lastHoveredItem = null
    this.teardownKeyboardNavigation()
  }

  closeAllContextMenus() {
    // Close any other open context menus on the page
    document.querySelectorAll('[data-ui--context-menu-target="content"][data-state="open"]').forEach(menu => {
      menu.classList.add('hidden')
      menu.setAttribute('data-state', 'closed')
    })
  }

  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', this.boundHandleKeydown)
  }

  teardownKeyboardNavigation() {
    document.removeEventListener('keydown', this.boundHandleKeydown)
  }

  handleKeydown(event) {
    if (!this.openValue) return

    const items = this.getFocusableItems()

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.focusNextItem(items)
        break

      case 'ArrowUp':
        event.preventDefault()
        this.focusPreviousItem(items)
        break

      case 'Home':
        event.preventDefault()
        this.focusItem(0, items)
        break

      case 'End':
        event.preventDefault()
        this.focusItem(items.length - 1, items)
        break

      case 'Escape':
        event.preventDefault()
        this.close()
        break

      case 'Enter':
      case ' ':
        event.preventDefault()
        const target = this.getKeyboardFocusedItem()
        if (target) {
          target.click()
          this.close()
        }
        break
    }
  }

  getFocusableItems() {
    if (!this.hasContentTarget) return []

    const content = this.contentTarget
    const items = []

    // Get direct children that are menu items (not disabled)
    Array.from(content.children).forEach(child => {
      const role = child.getAttribute('role')
      if (role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio') {
        if (!child.hasAttribute('data-disabled')) {
          items.push(child)
        }
      } else if (role === 'group') {
        // Radio group container
        const radioItems = child.querySelectorAll('[role="menuitemradio"]')
        radioItems.forEach(radioItem => {
          if (!radioItem.hasAttribute('data-disabled')) {
            items.push(radioItem)
          }
        })
      }
    })

    return items
  }

  getKeyboardFocusedItem() {
    const allItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
    return Array.from(allItems).find(item => item.getAttribute('tabindex') === '0')
  }

  focusNextItem(items = null) {
    items = items || this.getFocusableItems()
    if (items.length === 0) return

    let currentIndex = this.findCurrentItemIndex(items)

    if (currentIndex === -1 || currentIndex >= items.length - 1) {
      this.focusItem(0, items)
    } else {
      this.focusItem(currentIndex + 1, items)
    }
  }

  focusPreviousItem(items = null) {
    items = items || this.getFocusableItems()
    if (items.length === 0) return

    let currentIndex = this.findCurrentItemIndex(items)

    if (currentIndex === -1 || currentIndex === 0) {
      this.focusItem(items.length - 1, items)
    } else {
      this.focusItem(currentIndex - 1, items)
    }
  }

  findCurrentItemIndex(items) {
    const currentItem = items.find(item => item.getAttribute('tabindex') === '0')
    return currentItem ? items.indexOf(currentItem) : -1
  }

  focusItem(index, items = null) {
    items = items || this.getFocusableItems()
    if (items.length === 0 || index < 0 || index >= items.length) return

    // Remove tabindex from all items
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
    allMenuItems.forEach(item => {
      item.setAttribute('tabindex', '-1')
    })

    // Focus the target item
    const targetItem = items[index]
    targetItem.setAttribute('tabindex', '0')
    targetItem.focus()
    this.lastHoveredItem = targetItem
  }

  // Track hovered item
  trackHoveredItem(event) {
    const item = event.currentTarget

    // Remove DOM focus from currently focused element
    if (document.activeElement && document.activeElement.hasAttribute('role') &&
        (document.activeElement.getAttribute('role') === 'menuitem' ||
         document.activeElement.getAttribute('role') === 'menuitemcheckbox' ||
         document.activeElement.getAttribute('role') === 'menuitemradio')) {
      document.activeElement.blur()
    }

    // Remove keyboard focus from all items
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
    allMenuItems.forEach(menuItem => {
      menuItem.setAttribute('tabindex', '-1')
    })

    // Set tabindex="0" on the hovered item
    item.setAttribute('tabindex', '0')
    this.lastHoveredItem = item
  }

  positionContextMenu(x, y) {
    const content = this.contentTarget
    if (!content) return

    // Set initial position at cursor - position directly, no Floating UI computation
    Object.assign(content.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
    })

    // Check if menu would overflow viewport and adjust if needed
    requestAnimationFrame(() => {
      const rect = content.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      // Adjust horizontal position if overflowing right
      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 8
      }

      // Adjust vertical position if overflowing bottom
      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 8
      }

      // Ensure menu doesn't go off screen on left or top
      adjustedX = Math.max(8, adjustedX)
      adjustedY = Math.max(8, adjustedY)

      content.style.left = `${adjustedX}px`
      content.style.top = `${adjustedY}px`

      // Set data-side attribute for animations based on final position
      if (adjustedY < y) {
        content.setAttribute('data-side', 'top')
      } else if (adjustedX < x) {
        content.setAttribute('data-side', 'left')
      } else {
        content.setAttribute('data-side', 'bottom')
      }
    })
  }
}
