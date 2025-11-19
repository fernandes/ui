import { Controller } from "@hotwired/stimulus"
import { computePosition, flip, offset, shift, autoUpdate } from "@floating-ui/dom"

// Dropdown Menu controller with keyboard navigation support
export default class extends Controller {
  static targets = ["trigger", "menu", "content", "item"]
  static values = {
    open: { type: Boolean, default: false },
    placement: { type: String, default: "bottom-start" },
    offset: { type: Number, default: 4 },
    flip: { type: Boolean, default: true }
  }

  constructor() {
    super(...arguments)
    this.cleanup = null
    this.closeSubmenuTimeouts = new Map() // Track timeouts for closing submenus
    this.lastHoveredItem = null // Track last item with mouse hover
    this.shouldReturnFocusToTrigger = false // Flag to return focus after closing
  }

  connect() {
    // Close dropdown when clicking outside
    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    document.addEventListener('click', this.boundHandleClickOutside)
  }

  disconnect() {
    // Cleanup Floating UI auto-update
    if (this.cleanup) {
      this.cleanup()
      this.cleanup = null
    }

    // Clear all pending submenu close timeouts
    this.closeSubmenuTimeouts.forEach((timeoutId) => clearTimeout(timeoutId))
    this.closeSubmenuTimeouts.clear()

    document.removeEventListener('click', this.boundHandleClickOutside)
    document.removeEventListener('keydown', this.boundHandleKeydown)
  }

  // Submenu hover handlers
  openSubmenu(event) {
    const trigger = event.currentTarget
    const submenu = trigger.nextElementSibling

    // Remove DOM focus from currently focused element to clear :focus pseudo-class
    if (document.activeElement && document.activeElement.hasAttribute('role') &&
        document.activeElement.getAttribute('role') === 'menuitem') {
      document.activeElement.blur()
    }

    // Remove keyboard focus from all items, except this one
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"]')
    allMenuItems.forEach(menuItem => {
      menuItem.setAttribute('tabindex', '-1')
    })

    // Set tabindex="0" on the hovered trigger
    trigger.setAttribute('tabindex', '0')

    // Track the hovered item for keyboard navigation continuity
    this.lastHoveredItem = trigger

    // Cancel any pending close timeout for this submenu
    if (this.closeSubmenuTimeouts.has(trigger)) {
      clearTimeout(this.closeSubmenuTimeouts.get(trigger))
      this.closeSubmenuTimeouts.delete(trigger)
    }

    if (submenu && submenu.hasAttribute('role') && submenu.getAttribute('role') === 'menu') {
      // Close sibling submenus (not parent or child submenus)
      this.closeSiblingSubmenus(trigger)

      // Open this submenu
      submenu.classList.remove('hidden')
      submenu.setAttribute('data-state', 'open')
      trigger.setAttribute('data-state', 'open')

      // Position submenu using Floating UI
      this.positionSubmenu(trigger, submenu)

      // If submenu contains a command controller, focus first item
      this.focusFirstCommandItem(submenu)
    }
  }

  // Position submenu with Floating UI
  positionSubmenu(trigger, submenu) {
    // Get placement from submenu's data attributes
    const side = submenu.getAttribute('data-side') || 'right'
    const align = submenu.getAttribute('data-align') || 'start'
    const placement = `${side}-${align}`

    computePosition(trigger, submenu, {
      placement: placement,
      middleware: [
        offset(8),
        flip(),
        shift({ padding: 8 })
      ],
      strategy: 'absolute'
    }).then(({ x, y, placement: finalPlacement }) => {
      Object.assign(submenu.style, {
        left: `${x}px`,
        top: `${y}px`,
      })

      // Update data-side and data-align based on final placement
      const [finalSide, finalAlign] = finalPlacement.split('-')
      submenu.setAttribute('data-side', finalSide)
      submenu.setAttribute('data-align', finalAlign || 'center')
    })
  }

  // Focus first item in command menu if present in submenu
  focusFirstCommandItem(submenu) {
    const commandElement = submenu.querySelector('[data-controller~="command"]')
    if (!commandElement) return

    // Wait a tick for command controller to initialize
    setTimeout(() => {
      const firstOption = commandElement.querySelector('[role="option"]:not([data-hidden])')
      if (firstOption) {
        // Remove any existing focus
        const allOptions = commandElement.querySelectorAll('[role="option"]')
        allOptions.forEach(option => {
          option.removeAttribute('data-focused')
          option.classList.remove('bg-accent', 'text-accent-foreground')
        })

        // Focus first item
        firstOption.setAttribute('data-focused', 'true')
        firstOption.classList.add('bg-accent', 'text-accent-foreground')
      }
    }, 50)
  }

  // Track hovered item (for items without submenu)
  trackHoveredItem(event) {
    const item = event.currentTarget

    // Remove DOM focus from currently focused element to clear :focus pseudo-class
    if (document.activeElement && document.activeElement.hasAttribute('role') &&
        document.activeElement.getAttribute('role') === 'menuitem') {
      document.activeElement.blur()
    }

    // Remove keyboard focus from all items, except this one
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"]')
    allMenuItems.forEach(menuItem => {
      menuItem.setAttribute('tabindex', '-1')
    })

    // Set tabindex="0" on the hovered item
    item.setAttribute('tabindex', '0')

    // Track the hovered item for keyboard navigation continuity
    this.lastHoveredItem = item
  }

  // Toggle checkbox state
  toggleCheckbox(event) {
    const item = event.currentTarget

    // Only handle checkbox items
    if (item.getAttribute('role') !== 'menuitemcheckbox') return

    // Don't close dropdown when clicking checkbox
    event.stopPropagation()

    // Toggle checked state
    const currentState = item.getAttribute('data-state')
    const newState = currentState === 'checked' ? 'unchecked' : 'checked'
    const isChecked = newState === 'checked'

    item.setAttribute('data-state', newState)
    item.setAttribute('aria-checked', isChecked)

    // Toggle check icon visibility
    const checkIcon = item.querySelector('[data-state="checked"]')
    if (checkIcon) {
      checkIcon.parentElement.innerHTML = isChecked ? `
        <span data-state="checked">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check size-4">
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
        </span>
      ` : ''
    } else if (isChecked) {
      // Add check icon if it doesn't exist
      const iconContainer = item.querySelector('.absolute.left-2')
      if (iconContainer) {
        iconContainer.innerHTML = `
          <span data-state="checked">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check size-4">
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          </span>
        `
      }
    }
  }

  // Select radio item (only one can be selected in a group)
  selectRadio(event) {
    const item = event.currentTarget

    // Only handle radio items
    if (item.getAttribute('role') !== 'menuitemradio') return

    // Don't close dropdown when clicking radio
    event.stopPropagation()

    // Find the radio group (parent menu or radio group container)
    const radioGroup = item.closest('[role="group"]') || item.closest('[role="menu"]')
    if (!radioGroup) return

    // Uncheck all radio items in the same group
    const allRadios = radioGroup.querySelectorAll('[role="menuitemradio"]')
    allRadios.forEach(radio => {
      radio.setAttribute('data-state', 'unchecked')
      radio.setAttribute('aria-checked', 'false')
      const iconContainer = radio.querySelector('.absolute.left-2')
      if (iconContainer) {
        iconContainer.innerHTML = ''
      }
    })

    // Check the clicked item
    item.setAttribute('data-state', 'checked')
    item.setAttribute('aria-checked', 'true')

    // Add radio indicator
    const iconContainer = item.querySelector('.absolute.left-2')
    if (iconContainer) {
      iconContainer.innerHTML = `
        <span data-state="checked">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle size-2 fill-current">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </span>
      `
    }
  }

  closeSubmenu(event) {
    const trigger = event.currentTarget
    const submenu = trigger.nextElementSibling
    const relatedTarget = event.relatedTarget

    // Cancel if we're moving to the submenu itself or a child element
    if (relatedTarget && submenu && submenu.contains(relatedTarget)) {
      return
    }

    // Add delay before closing to allow navigation to nested submenus
    const timeoutId = setTimeout(() => {
      if (submenu && submenu.hasAttribute('role') && submenu.getAttribute('role') === 'menu') {
        // Close this submenu and all its children
        this.closeSubmenuAndChildren(submenu, trigger)
      }
      this.closeSubmenuTimeouts.delete(trigger)
    }, 300) // 300ms delay allows smooth navigation

    this.closeSubmenuTimeouts.set(trigger, timeoutId)
  }

  closeSubmenuAndChildren(submenu, trigger) {
    // Close all nested submenus first
    const nestedSubmenus = submenu.querySelectorAll('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]')
    nestedSubmenus.forEach(nested => {
      nested.classList.add('hidden')
      nested.setAttribute('data-state', 'closed')
      // Find and close the trigger
      const nestedTrigger = nested.previousElementSibling
      if (nestedTrigger) {
        nestedTrigger.setAttribute('data-state', 'closed')
      }
    })

    // Close the submenu itself
    submenu.classList.add('hidden')
    submenu.setAttribute('data-state', 'closed')
    trigger.setAttribute('data-state', 'closed')
  }

  closeSiblingSubmenus(currentTrigger) {
    // Find the parent menu
    const parentMenu = currentTrigger.closest('[role="menu"]')
    if (!parentMenu) return

    // Close all submenus that are siblings (same level)
    const siblingTriggers = Array.from(parentMenu.children).filter(child => {
      return child !== currentTrigger && child.hasAttribute('data-dropdown-target') && child.getAttribute('data-dropdown-target').includes('item')
    })

    siblingTriggers.forEach(sibling => {
      const siblingSubmenu = sibling.nextElementSibling
      if (siblingSubmenu && siblingSubmenu.hasAttribute('role') && siblingSubmenu.getAttribute('role') === 'menu') {
        this.closeSubmenuAndChildren(siblingSubmenu, sibling)
      }
    })
  }

  closeAllSubmenus() {
    const submenus = this.element.querySelectorAll('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]')
    submenus.forEach(submenu => {
      submenu.classList.add('hidden')
      submenu.setAttribute('data-state', 'closed')

      const trigger = submenu.previousElementSibling
      if (trigger) {
        trigger.setAttribute('data-state', 'closed')
      }
    })
  }

  toggle(event) {
    // Don't stopPropagation - allow click to reach document for handleClickOutside
    // event.stopPropagation()
    this.openValue = !this.openValue

    const target = this.hasMenuTarget ? this.menuTarget : this.contentTarget
    target.classList.toggle('hidden')

    if (!target.classList.contains('hidden')) {
      // Menu is opening
      target.setAttribute('data-state', 'open')
      this.positionDropdown()
      this.setupKeyboardNavigation()

      // Focus first item after a short delay
      setTimeout(() => {
        this.focusItem(0)
      }, 100)
    } else {
      // Menu is closing
      target.setAttribute('data-state', 'closed')
      this.teardownKeyboardNavigation()
    }
  }

  close(options = {}) {
    const { returnFocus = this.shouldReturnFocusToTrigger } = options

    this.openValue = false
    const target = this.hasMenuTarget ? this.menuTarget : this.contentTarget

    // Close all submenus before closing main menu
    this.closeAllSubmenus()

    // Clear keyboard/hover focus from all items (including checkboxes and radios)
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
    allMenuItems.forEach(item => {
      item.setAttribute('tabindex', '-1')
    })

    // Clear last hovered item
    this.lastHoveredItem = null

    if (target) {
      target.classList.add('hidden')
      target.setAttribute('data-state', 'closed')
    }

    // Cleanup Floating UI auto-update when closing
    if (this.cleanup) {
      this.cleanup()
      this.cleanup = null
    }

    this.teardownKeyboardNavigation()

    // Return focus to trigger button (ARIA best practice)
    if (returnFocus && this.hasTriggerTarget) {
      // Use a longer delay to ensure all DOM updates and event handlers complete
      setTimeout(() => {
        if (this.triggerTarget) {
          this.triggerTarget.focus()
        }
      }, 150)
    }

    // Reset the flag
    this.shouldReturnFocusToTrigger = false
  }

  handleClickOutside(event) {
    // Check if click is outside this dropdown
    if (!this.element.contains(event.target)) {
      this.close({ returnFocus: false })
    } else if (this.hasTriggerTarget && this.triggerTarget.contains(event.target)) {
      // Click is on our own trigger - toggle() will handle it, don't close here
      return
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

    // Get the currently focused element
    const focusedElement = document.activeElement

    // Check if we're in a command controller by looking for a focused command option
    const focusedCommandOption = this.element.querySelector('[data-controller~="command"] [role="option"][data-focused="true"]')
    if (focusedCommandOption && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      // Let command controller handle ArrowDown/Up
      const commandElement = focusedCommandOption.closest('[data-controller~="command"]')
      this.handleCommandNavigation(event, commandElement)
      return
    }

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

      case 'ArrowRight':
        event.preventDefault()
        // If focused item has a submenu, open it
        if (focusedElement && this.hasSubmenu(focusedElement)) {
          this.openSubmenuWithKeyboard(focusedElement)
        }
        break

      case 'ArrowLeft':
        event.preventDefault()
        // If we're in a command, close it and return to parent menu
        if (focusedCommandOption) {
          const commandElement = focusedCommandOption.closest('[data-controller~="command"]')
          this.closeCommandSubmenu(commandElement)
        } else {
          // Close current submenu and return focus to parent
          this.closeCurrentSubmenuWithKeyboard(focusedElement)
        }
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
        // Close only the current submenu level, or entire menu if at top level
        if (focusedCommandOption) {
          const commandElement = focusedCommandOption.closest('[data-controller~="command"]')
          this.closeCommandSubmenu(commandElement)
        } else if (!this.closeCurrentSubmenuWithKeyboard(focusedElement)) {
          this.close()
        }
        break

      case 'Enter':
        event.preventDefault()
        // Find the item with keyboard focus (tabindex="0") or DOM focus
        const enterTarget = this.getKeyboardFocusedItem() || focusedElement
        if (enterTarget && enterTarget.hasAttribute('role')) {
          const role = enterTarget.getAttribute('role')

          if (role === 'menuitem') {
            // Regular menu item: open submenu or activate and close
            if (this.hasSubmenu(enterTarget)) {
              this.openSubmenuWithKeyboard(enterTarget)
            } else {
              enterTarget.click()
              this.close()
            }
          } else if (role === 'menuitemcheckbox' || role === 'menuitemradio') {
            // Checkbox/Radio: toggle/select and close menu (ARIA spec)
            enterTarget.click()
            // Set flag to return focus after close completes
            this.shouldReturnFocusToTrigger = true
            this.close()
          }
        }
        break

      case ' ':
        event.preventDefault()
        // Find the item with keyboard focus (tabindex="0") or DOM focus
        const spaceTarget = this.getKeyboardFocusedItem() || focusedElement
        if (spaceTarget && spaceTarget.hasAttribute('role')) {
          const role = spaceTarget.getAttribute('role')

          if (role === 'menuitem') {
            // Regular menu item: open submenu or activate and close
            if (this.hasSubmenu(spaceTarget)) {
              this.openSubmenuWithKeyboard(spaceTarget)
            } else {
              spaceTarget.click()
              this.close()
            }
          } else if (role === 'menuitemcheckbox' || role === 'menuitemradio') {
            // Checkbox/Radio: toggle/select but keep menu open (ARIA spec)
            spaceTarget.click()
            // Don't close the menu - this is the key difference from Enter
          }
        }
        break
    }
  }

  getFocusableItems() {
    // Find the item with tabindex="0" to determine which menu level we're in
    const allItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
    const currentItem = Array.from(allItems).find(item => item.getAttribute('tabindex') === '0')
    console.log('[getFocusableItems] currentItem with tabindex="0":', currentItem?.textContent.trim())
    let currentMenu = null

    if (currentItem) {
      // Find the menu that contains the current item (with tabindex="0")
      currentMenu = currentItem.closest('[role="menu"]')
      console.log('[getFocusableItems] found currentMenu from currentItem, data-side:', currentMenu?.getAttribute('data-side'))
    } else {
      // Default to the main menu if no item has tabindex="0"
      currentMenu = this.hasMenuTarget ? this.menuTarget : this.contentTarget
      console.log('[getFocusableItems] no currentItem, defaulting to main menu. hasMenuTarget:', this.hasMenuTarget, 'hasContentTarget:', this.hasContentTarget, 'currentMenu children count:', currentMenu?.children.length)
    }

    if (!currentMenu) {
      console.log('[getFocusableItems] no currentMenu found, returning empty array')
      return []
    }

    // Get menuitems - they can be direct children OR children of submenu containers
    const items = []
    Array.from(currentMenu.children).forEach((child, index) => {
      const role = child.getAttribute('role')
      console.log(`[getFocusableItems] child ${index}: role="${role}", hasDataDisabled=${child.hasAttribute('data-disabled')}`)

      // Check for menuitem, menuitemcheckbox, or menuitemradio
      if (child.hasAttribute('role') && (role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio')) {
        // Direct menu item child
        if (!child.hasAttribute('data-disabled')) {
          console.log(`[getFocusableItems] Adding child ${index} to items (role=${role})`)
          items.push(child)
        }
      } else if (child.getAttribute('role') === 'group') {
        // Radio group container - get all radio items inside
        const radioItems = child.querySelectorAll('[role="menuitemradio"]')
        console.log(`[getFocusableItems] Found radio group with ${radioItems.length} radio items`)
        radioItems.forEach(radioItem => {
          if (!radioItem.hasAttribute('data-disabled')) {
            items.push(radioItem)
          }
        })
      } else if (child.classList && child.classList.contains('relative')) {
        // Submenu container - get the trigger (first child with role="menuitem"]')
        const trigger = child.querySelector(':scope > [role="menuitem"]')
        if (trigger && !trigger.hasAttribute('data-disabled')) {
          items.push(trigger)
        }
      }
    })

    console.log('[getFocusableItems] returning items:', items.map(i => i.textContent.trim()))
    return items
  }

  focusNextItem(items = null) {
    items = items || this.getFocusableItems()
    console.log('[focusNextItem] items:', items.map(i => i.textContent.trim()))
    if (items.length === 0) return

    // Try to find currently focused item, or item with hover
    let currentIndex = this.findCurrentItemIndex(items)
    console.log('[focusNextItem] currentIndex:', currentIndex, 'item:', items[currentIndex]?.textContent.trim())

    // Move to next item
    if (currentIndex === -1 || currentIndex >= items.length - 1) {
      console.log('[focusNextItem] wrapping to 0 or starting at 0')
      this.focusItem(0, items)
    } else {
      console.log('[focusNextItem] moving to index:', currentIndex + 1, 'item:', items[currentIndex + 1]?.textContent.trim())
      this.focusItem(currentIndex + 1, items)
    }
  }

  focusPreviousItem(items = null) {
    items = items || this.getFocusableItems()
    if (items.length === 0) return

    // Try to find currently focused item, or item with hover
    let currentIndex = this.findCurrentItemIndex(items)

    // Move to previous item
    if (currentIndex === -1 || currentIndex === 0) {
      this.focusItem(items.length - 1, items)
    } else {
      this.focusItem(currentIndex - 1, items)
    }
  }

  // Find the current item index - look for item with tabindex="0"
  findCurrentItemIndex(items) {
    // Find the item with tabindex="0" (either keyboard focused or mouse hovered)
    const currentItem = items.find(item => item.getAttribute('tabindex') === '0')

    if (currentItem) {
      return items.indexOf(currentItem)
    }

    return -1
  }

  focusItem(index, items = null) {
    console.log('[focusItem] called with index:', index, 'items passed:', items?.map(i => i.textContent.trim()))
    // Always recalculate items to ensure we have the current menu items after any DOM changes
    items = this.getFocusableItems()
    console.log('[focusItem] after recalculating, items:', items.map(i => i.textContent.trim()))
    if (items.length === 0 || index < 0 || index >= items.length) {
      console.log('[focusItem] early return - items.length:', items.length, 'index:', index)
      return
    }

    // Close all submenus in the current menu level when navigating with keyboard
    const currentMenu = items[0] ? items[0].closest('[role="menu"]') : null
    if (currentMenu) {
      const siblingsWithSubmenus = Array.from(currentMenu.children).filter(child => {
        if (child.classList && child.classList.contains('relative')) {
          const trigger = child.querySelector(':scope > [role="menuitem"]')
          const submenu = trigger?.nextElementSibling
          return submenu && submenu.hasAttribute('role') && submenu.getAttribute('role') === 'menu'
        }
        return false
      })

      siblingsWithSubmenus.forEach(container => {
        const trigger = container.querySelector(':scope > [role="menuitem"]')
        const submenu = trigger?.nextElementSibling
        if (submenu && submenu.getAttribute('data-state') === 'open') {
          this.closeSubmenuAndChildren(submenu, trigger)
        }
      })
    }

    // Remove tabindex from ALL menuitems in the entire dropdown (not just current menu)
    // This ensures only ONE item has tabindex="0" at any time, preventing stale tabindex
    // values in closed submenus from interfering with getFocusableItems()
    console.log('[focusItem] setting ALL menuitems in dropdown to tabindex="-1"')
    const allMenuItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
    allMenuItems.forEach(item => {
      item.setAttribute('tabindex', '-1')
    })

    // Focus the target item
    const targetItem = items[index]
    if (!targetItem) {
      console.error('[focusItem] ERROR: targetItem is undefined at index', index, 'items:', items)
      return
    }

    console.log('[focusItem] setting focus on item at index', index, ':', targetItem.textContent.trim())
    targetItem.setAttribute('tabindex', '0')
    targetItem.focus()

    // Clear last hovered item since we're now using keyboard
    // this.lastHoveredItem = null
    this.lastHoveredItem = targetItem
    console.log('[focusItem] done, lastHoveredItem:', this.lastHoveredItem?.textContent.trim())
  }

  // Check if a menu item has a submenu
  // Get the menu item that currently has keyboard focus (tabindex="0")
  getKeyboardFocusedItem() {
    const allItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
    return Array.from(allItems).find(item => item.getAttribute('tabindex') === '0')
  }

  hasSubmenu(menuItem) {
    if (!menuItem) return false
    const nextSibling = menuItem.nextElementSibling
    return nextSibling && nextSibling.hasAttribute('role') && nextSibling.getAttribute('role') === 'menu'
  }

  // Open submenu with keyboard and focus first item
  openSubmenuWithKeyboard(trigger) {
    const submenu = trigger.nextElementSibling

    if (submenu && submenu.hasAttribute('role') && submenu.getAttribute('role') === 'menu') {
      // Close sibling submenus
      this.closeSiblingSubmenus(trigger)

      // Open this submenu
      submenu.classList.remove('hidden')
      submenu.setAttribute('data-state', 'open')
      trigger.setAttribute('data-state', 'open')

      // Position submenu using Floating UI
      this.positionSubmenu(trigger, submenu)

      // Check if submenu contains a command controller
      const commandElement = submenu.querySelector('[data-controller~="command"]')
      if (commandElement) {
        // Focus first command item
        this.focusFirstCommandItem(submenu)
        return
      }

      // Get all menuitems in the submenu
      const submenuItems = []
      Array.from(submenu.children).forEach(child => {
        if (child.hasAttribute('role') && child.getAttribute('role') === 'menuitem') {
          if (!child.hasAttribute('data-disabled')) {
            submenuItems.push(child)
          }
        } else if (child.classList && child.classList.contains('relative')) {
          const itemTrigger = child.querySelector(':scope > [role="menuitem"]')
          if (itemTrigger && !itemTrigger.hasAttribute('data-disabled')) {
            submenuItems.push(itemTrigger)
          }
        }
      })

      // Remove tabindex from ALL menuitems in the dropdown to ensure clean state
      const allMenuItems = this.element.querySelectorAll('[role="menuitem"]')
      allMenuItems.forEach(item => {
        item.setAttribute('tabindex', '-1')
      })

      // Focus first item in submenu
      if (submenuItems.length > 0) {
        const firstItem = submenuItems[0]
        firstItem.setAttribute('tabindex', '0')
        firstItem.focus()
        this.lastHoveredItem = firstItem
      }
    }
  }

  // Close current submenu and return focus to parent trigger
  // Returns true if a submenu was closed, false if we're at top level
  closeCurrentSubmenuWithKeyboard(focusedElement) {
    // Find the item with tabindex="0" (current item) instead of using focusedElement
    const allItems = this.element.querySelectorAll('[role="menuitem"]')
    const currentItem = Array.from(allItems).find(item => item.getAttribute('tabindex') === '0')

    if (!currentItem) return false

    // Find the closest parent menu (the menu containing the current item)
    const parentMenu = currentItem.closest('[role="menu"]')
    if (!parentMenu) return false

    // Check if this menu is a submenu (has data-side="right" or "right-start")
    const dataSide = parentMenu.getAttribute('data-side')
    if (dataSide === 'right' || dataSide === 'right-start') {
      // Find the trigger that opened this submenu
      const trigger = parentMenu.previousElementSibling

      // Close this submenu and all its children
      this.closeSubmenuAndChildren(parentMenu, trigger)

      // Return focus to the trigger
      if (trigger) {
        // Find the parent menu of the trigger to get all items in that level
        const triggerParentMenu = trigger.closest('[role="menu"]')
        if (triggerParentMenu) {
          // Get all items in the trigger's menu level
          const parentMenuItems = []
          Array.from(triggerParentMenu.children).forEach(child => {
            if (child.hasAttribute('role') && child.getAttribute('role') === 'menuitem') {
              parentMenuItems.push(child)
            } else if (child.classList && child.classList.contains('relative')) {
              const itemTrigger = child.querySelector(':scope > [role="menuitem"]')
              if (itemTrigger) {
                parentMenuItems.push(itemTrigger)
              }
            }
          })

          // Set tabindex on all items in parent menu
          parentMenuItems.forEach(item => {
            item.setAttribute('tabindex', '-1')
          })
        }

        // Set focus on the trigger
        trigger.setAttribute('tabindex', '0')
        trigger.focus()
        this.lastHoveredItem = trigger
      }

      return true
    }

    return false
  }

  // Handle navigation within command items
  handleCommandNavigation(event, commandElement) {
    event.preventDefault()

    const allOptions = Array.from(commandElement.querySelectorAll('[role="option"]:not([data-hidden])'))
    const currentOption = allOptions.find(opt => opt.getAttribute('data-focused') === 'true')
    let currentIndex = currentOption ? allOptions.indexOf(currentOption) : -1

    if (event.key === 'ArrowDown') {
      currentIndex = currentIndex < allOptions.length - 1 ? currentIndex + 1 : 0
    } else if (event.key === 'ArrowUp') {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : allOptions.length - 1
    }

    // Remove focus from all options
    allOptions.forEach(opt => {
      opt.removeAttribute('data-focused')
      opt.classList.remove('bg-accent', 'text-accent-foreground')
    })

    // Add focus to new option
    if (allOptions[currentIndex]) {
      allOptions[currentIndex].setAttribute('data-focused', 'true')
      allOptions[currentIndex].classList.add('bg-accent', 'text-accent-foreground')
      allOptions[currentIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }

  // Close command submenu and return to parent menu
  closeCommandSubmenu(commandElement) {
    const submenu = commandElement.closest('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]')
    if (!submenu) return false

    const trigger = submenu.previousElementSibling
    if (!trigger || trigger.getAttribute('role') !== 'menuitem') return false

    // Clear data-focused from all command options to prevent them from interfering with main menu navigation
    const allCommandOptions = commandElement.querySelectorAll('[role="option"]')
    allCommandOptions.forEach(option => {
      option.removeAttribute('data-focused')
      option.classList.remove('bg-accent', 'text-accent-foreground')
    })

    // Close the submenu
    submenu.classList.add('hidden')
    submenu.setAttribute('data-state', 'closed')
    trigger.setAttribute('data-state', 'closed')

    // Find parent menu and its items
    const parentMenu = trigger.closest('[role="menu"]')
    if (parentMenu) {
      const parentItems = []
      Array.from(parentMenu.children).forEach(child => {
        if (child.hasAttribute('role') && child.getAttribute('role') === 'menuitem') {
          parentItems.push(child)
        } else if (child.classList && child.classList.contains('relative')) {
          const itemTrigger = child.querySelector(':scope > [role="menuitem"]')
          if (itemTrigger) {
            parentItems.push(itemTrigger)
          }
        }
      })

      // Set tabindex on all parent items
      parentItems.forEach(item => {
        item.setAttribute('tabindex', '-1')
      })
    }

    // Return focus to trigger
    trigger.setAttribute('tabindex', '0')
    trigger.focus()
    this.lastHoveredItem = trigger

    return true
  }

  positionDropdown() {
    // Get trigger and content elements
    const trigger = this.hasTriggerTarget ? this.triggerTarget : this.element
    const content = this.hasContentTarget ? this.contentTarget : this.menuTarget

    if (!trigger || !content) return

    // Cleanup previous auto-update if exists
    if (this.cleanup) {
      this.cleanup()
    }

    // Setup middleware for Floating UI
    const middleware = []

    // Always add offset if specified
    if (this.offsetValue > 0) {
      middleware.push(offset(this.offsetValue))
    }

    // Add flip to automatically adjust placement when overflowing (if enabled)
    if (this.flipValue) {
      middleware.push(flip())
    }

    // Add shift to keep dropdown in viewport
    middleware.push(shift({ padding: 8 }))

    // Define update function
    const update = () => {
      computePosition(trigger, content, {
        placement: this.placementValue,
        middleware: middleware,
        strategy: 'absolute'
      }).then(({ x, y, placement, middlewareData }) => {
        Object.assign(content.style, {
          left: `${x}px`,
          top: `${y}px`,
        })

        // Update data-side attribute for CSS styling
        const side = placement.split('-')[0]
        content.setAttribute('data-side', side)

        // Update data-align attribute for CSS styling
        const align = placement.split('-')[1] || 'center'
        content.setAttribute('data-align', align)
      })
    }

    // Use autoUpdate to keep position synchronized
    this.cleanup = autoUpdate(
      trigger,
      content,
      update,
      {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
        layoutShift: true,
        animationFrame: true
      }
    )
  }
}
