import { Controller } from "@hotwired/stimulus"
import { computePosition, flip, offset, shift, autoUpdate } from "@floating-ui/dom"
import {
  getFocusableItems,
  findCurrentItemIndex,
  focusItem as focusItemUtil,
  focusNextItem as focusNextItemUtil,
  focusPreviousItem as focusPreviousItemUtil,
  hasSubmenu,
  openSubmenu,
  closeSubmenu,
  closeAllSubmenus,
  positionSubmenu,
  clearAllTabindexes,
  getKeyboardFocusedItem
} from "../utils/menu_utils.js"

// Dropdown Menu controller with keyboard navigation support
export default class extends Controller {
  static targets = ["trigger", "menu", "content", "item"]
  static values = {
    open: { type: Boolean, default: false },
    placement: { type: String, default: "bottom-start" },
    offset: { type: Number, default: 4 },
    flip: { type: Boolean, default: true },
    strategy: { type: String, default: "fixed" }
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
    this.boundHandleFocusOut = this.handleFocusOut.bind(this)
    document.addEventListener('click', this.boundHandleClickOutside)

    // Listen for focus leaving the dropdown
    this.element.addEventListener('focusout', this.boundHandleFocusOut)
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
    this.element.removeEventListener('focusout', this.boundHandleFocusOut)
  }

  handleFocusOut(event) {
    // Don't do anything if dropdown is not open
    if (!this.openValue) return

    // Check if focus is moving outside the dropdown element
    // Use setTimeout to allow the new focus target to be set
    setTimeout(() => {
      const newFocusedElement = document.activeElement

      // If the new focused element is outside our dropdown, close without returning focus
      if (!this.element.contains(newFocusedElement)) {
        this.close({ returnFocus: false })
      }
    }, 0)
  }

  // Submenu hover handlers
  openSubmenuHandler(event) {
    const trigger = event.currentTarget
    const submenu = trigger.nextElementSibling

    // Remove keyboard focus from all items, except this one
    clearAllTabindexes(this.element)

    // Set tabindex="0" on the hovered trigger and focus it
    // Focusing the new item instead of blurring the old one keeps focus inside
    // the dropdown, preventing handleFocusOut from closing the menu
    trigger.setAttribute('tabindex', '0')
    trigger.focus()

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

      // Open this submenu using utility
      openSubmenu(trigger, submenu)

      // If submenu contains a command controller, focus first item
      this.focusFirstCommandItem(submenu)
    }
  }

  // Backwards compatibility alias
  openSubmenu(event) {
    return this.openSubmenuHandler(event)
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

    // Remove keyboard focus from all items, except this one
    clearAllTabindexes(this.element)

    // Set tabindex="0" on the hovered item and focus it
    // Focusing the new item instead of blurring the old one keeps focus inside
    // the dropdown, preventing handleFocusOut from closing the menu
    item.setAttribute('tabindex', '0')
    item.focus()

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

  closeSubmenuHandler(event) {
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
        // Close this submenu and all its children using utility
        closeSubmenu(submenu, trigger)
      }
      this.closeSubmenuTimeouts.delete(trigger)
    }, 300) // 300ms delay allows smooth navigation

    this.closeSubmenuTimeouts.set(trigger, timeoutId)
  }

  // Backwards compatibility alias - closeSubmenu is used in HTML with data-action
  closeSubmenu(event) {
    return this.closeSubmenuHandler(event)
  }

  closeSiblingSubmenus(currentTrigger) {
    // Find the parent menu
    const parentMenu = currentTrigger.closest('[role="menu"]')
    if (!parentMenu) return

    // Close all submenus that are siblings (same level)
    // Note: We filter by data-dropdown-target for backwards compatibility with existing HTML
    const siblingTriggers = Array.from(parentMenu.children).filter(child => {
      return child !== currentTrigger && child.hasAttribute('data-dropdown-target') && child.getAttribute('data-dropdown-target').includes('item')
    })

    siblingTriggers.forEach(sibling => {
      const siblingSubmenu = sibling.nextElementSibling
      if (siblingSubmenu && siblingSubmenu.hasAttribute('role') && siblingSubmenu.getAttribute('role') === 'menu') {
        closeSubmenu(siblingSubmenu, sibling)
      }
    })
  }

  closeAllSubmenusHandler() {
    closeAllSubmenus(this.element)
  }

  // Backwards compatibility alias
  closeAllSubmenus() {
    return this.closeAllSubmenusHandler()
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
    closeAllSubmenus(this.element)

    // Clear keyboard/hover focus from all items (including checkboxes and radios)
    clearAllTabindexes(this.element)

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
      setTimeout(() => {
        this.focusTrigger()
      }, 0)
    }

    // Reset the flag
    this.shouldReturnFocusToTrigger = false
  }

  // Focus the trigger element, or first focusable child if trigger is not focusable
  focusTrigger() {
    if (!this.triggerTarget) return

    // Check if trigger itself is focusable
    const isFocusable = this.triggerTarget.matches('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')

    if (isFocusable) {
      this.triggerTarget.focus()
    } else {
      // Find first focusable element inside the trigger
      const focusableChild = this.triggerTarget.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (focusableChild) {
        focusableChild.focus()
      }
    }
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
        if (focusedElement && hasSubmenu(focusedElement)) {
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
          // Return focus to trigger when closing with Escape (ARIA best practice)
          this.close({ returnFocus: true })
        }
        break

      case 'Enter':
        event.preventDefault()
        // Find the item with keyboard focus (tabindex="0") or DOM focus
        const enterTarget = getKeyboardFocusedItem(this.element) || focusedElement
        if (enterTarget && enterTarget.hasAttribute('role')) {
          const role = enterTarget.getAttribute('role')

          if (role === 'menuitem') {
            // Regular menu item: open submenu or activate and close
            if (hasSubmenu(enterTarget)) {
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
        const spaceTarget = getKeyboardFocusedItem(this.element) || focusedElement
        if (spaceTarget && spaceTarget.hasAttribute('role')) {
          const role = spaceTarget.getAttribute('role')

          if (role === 'menuitem') {
            // Regular menu item: open submenu or activate and close
            if (hasSubmenu(spaceTarget)) {
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
    // Determine the current menu based on the item with tabindex="0"
    const currentMenu = this.getCurrentMenu()
    return getFocusableItems(this.element, currentMenu)
  }

  getCurrentMenu() {
    const allItems = this.element.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
    const currentItem = Array.from(allItems).find(item => item.getAttribute('tabindex') === '0')

    if (currentItem) {
      return currentItem.closest('[role="menu"]')
    }

    // Default to the main menu if no item has tabindex="0"
    return this.hasMenuTarget ? this.menuTarget : this.contentTarget
  }

  focusNextItem(items = null) {
    items = items || this.getFocusableItems()
    if (items.length === 0) return

    const result = focusNextItemUtil(items, this.element, true)
    if (result) {
      this.lastHoveredItem = result
    }
  }

  focusPreviousItem(items = null) {
    items = items || this.getFocusableItems()
    if (items.length === 0) return

    const result = focusPreviousItemUtil(items, this.element, true)
    if (result) {
      this.lastHoveredItem = result
    }
  }

  focusItem(index, items = null) {
    // Always recalculate items to ensure we have the current menu items after any DOM changes
    items = this.getFocusableItems()
    if (items.length === 0 || index < 0 || index >= items.length) {
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
          closeSubmenu(submenu, trigger)
        }
      })
    }

    // Focus the target item using utility
    const targetItem = focusItemUtil(items, index, this.element)
    if (targetItem) {
      this.lastHoveredItem = targetItem
    }
  }

  // Open submenu with keyboard and focus first item
  openSubmenuWithKeyboard(trigger) {
    const submenu = trigger.nextElementSibling

    if (submenu && submenu.hasAttribute('role') && submenu.getAttribute('role') === 'menu') {
      // Close sibling submenus
      this.closeSiblingSubmenus(trigger)

      // Open this submenu using utility
      openSubmenu(trigger, submenu)

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
      clearAllTabindexes(this.element)

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

      // Close this submenu and all its children using utility
      closeSubmenu(parentMenu, trigger)

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

    // Close the submenu using utility
    closeSubmenu(submenu, trigger)

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

    // Set trigger width CSS variable for dropdown content sizing
    content.style.setProperty('--ui-dropdown-menu-trigger-width', `${trigger.offsetWidth}px`)

    // Define update function
    const update = () => {
      computePosition(trigger, content, {
        placement: this.placementValue,
        middleware: middleware,
        strategy: this.strategyValue
      }).then(({ x, y, placement, middlewareData }) => {
        // Update trigger width in case it changed
        content.style.setProperty('--ui-dropdown-menu-trigger-width', `${trigger.offsetWidth}px`)

        Object.assign(content.style, {
          position: this.strategyValue,
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
