/**
 * Menu Utilities
 *
 * Shared utilities for dropdown and menubar controllers.
 * Provides common functionality for menu navigation, checkbox/radio management,
 * and submenu handling.
 */

import { computePosition, flip, offset, shift } from "@floating-ui/dom"

// =============================================================================
// CHECKBOX / RADIO MANAGEMENT
// =============================================================================

/**
 * Toggle checkbox state on a menuitemcheckbox element
 * @param {HTMLElement} item - The checkbox item element
 * @returns {boolean} The new checked state
 */
export function toggleCheckbox(item) {
  if (item.getAttribute('role') !== 'menuitemcheckbox') return false

  const currentState = item.getAttribute('data-state')
  const newState = currentState === 'checked' ? 'unchecked' : 'checked'
  const isChecked = newState === 'checked'

  item.setAttribute('data-state', newState)
  item.setAttribute('aria-checked', isChecked)

  // Update check icon visibility
  const iconContainer = item.querySelector('.absolute.left-2') ||
                        item.querySelector('span.absolute')
  if (iconContainer) {
    iconContainer.innerHTML = isChecked ? `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" data-state="checked">
        <path d="M20 6 9 17l-5-5"></path>
      </svg>
    ` : ''
  }

  return isChecked
}

/**
 * Select a radio item, deselecting others in the same group
 * @param {HTMLElement} item - The radio item to select
 * @returns {void}
 */
export function selectRadio(item) {
  if (item.getAttribute('role') !== 'menuitemradio') return

  // Find the radio group (parent with role="group" or closest menu)
  const radioGroup = item.closest('[role="group"]') || item.closest('[role="menu"]')
  if (!radioGroup) return

  // Uncheck all radio items in the group
  const allRadios = radioGroup.querySelectorAll('[role="menuitemradio"]')
  allRadios.forEach(radio => {
    radio.setAttribute('data-state', 'unchecked')
    radio.setAttribute('aria-checked', 'false')
    const iconContainer = radio.querySelector('.absolute.left-2') ||
                          radio.querySelector('span.absolute')
    if (iconContainer) {
      iconContainer.innerHTML = ''
    }
  })

  // Check the selected item
  item.setAttribute('data-state', 'checked')
  item.setAttribute('aria-checked', 'true')

  // Add radio indicator
  const iconContainer = item.querySelector('.absolute.left-2') ||
                        item.querySelector('span.absolute')
  if (iconContainer) {
    iconContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-2" data-state="checked">
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    `
  }
}

// =============================================================================
// ITEM NAVIGATION
// =============================================================================

/**
 * Get all focusable items in a menu container
 * @param {HTMLElement} container - The menu container
 * @param {HTMLElement|null} currentMenu - Optional specific menu to search in
 * @returns {HTMLElement[]} Array of focusable items
 */
export function getFocusableItems(container, currentMenu = null) {
  // If no specific menu, try to find the current menu from focused item
  if (!currentMenu) {
    const allItems = container.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
    const currentItem = Array.from(allItems).find(item => item.getAttribute('tabindex') === '0')

    if (currentItem) {
      currentMenu = currentItem.closest('[role="menu"]')
    }
  }

  if (!currentMenu) return []

  // Get menuitems - they can be direct children OR children of submenu containers
  const items = []
  Array.from(currentMenu.children).forEach(child => {
    const role = child.getAttribute('role')

    // Check for menuitem, menuitemcheckbox, or menuitemradio
    if (role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio') {
      if (!child.hasAttribute('data-disabled')) {
        items.push(child)
      }
    } else if (role === 'group') {
      // Radio group container - get all radio items inside
      const radioItems = child.querySelectorAll('[role="menuitemradio"]')
      radioItems.forEach(radioItem => {
        if (!radioItem.hasAttribute('data-disabled')) {
          items.push(radioItem)
        }
      })
    } else if (child.classList && child.classList.contains('relative')) {
      // Submenu container - get the trigger (first child with role="menuitem")
      const trigger = child.querySelector(':scope > [role="menuitem"]')
      if (trigger && !trigger.hasAttribute('data-disabled')) {
        items.push(trigger)
      }
    }
  })

  return items
}

/**
 * Find the index of the currently focused item
 * @param {HTMLElement[]} items - Array of focusable items
 * @returns {number} Index of current item, or -1 if not found
 */
export function findCurrentItemIndex(items) {
  const currentItem = items.find(item => item.getAttribute('tabindex') === '0')
  return currentItem ? items.indexOf(currentItem) : -1
}

/**
 * Focus a specific item by index
 * @param {HTMLElement[]} items - Array of focusable items
 * @param {number} index - Index to focus
 * @param {HTMLElement} container - The root container (for resetting all tabindexes)
 */
export function focusItem(items, index, container) {
  if (items.length === 0 || index < 0 || index >= items.length) return

  // Remove tabindex from ALL menuitems in the container
  const allMenuItems = container.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
  allMenuItems.forEach(item => {
    item.setAttribute('tabindex', '-1')
  })

  // Focus the target item
  const targetItem = items[index]
  targetItem.setAttribute('tabindex', '0')
  targetItem.focus()

  return targetItem
}

/**
 * Focus the next item in the list
 * @param {HTMLElement[]} items - Array of focusable items
 * @param {HTMLElement} container - The root container
 * @param {boolean} loop - Whether to loop back to start
 * @returns {HTMLElement|null} The newly focused item
 */
export function focusNextItem(items, container, loop = true) {
  if (items.length === 0) return null

  let currentIndex = findCurrentItemIndex(items)

  if (currentIndex === -1 || currentIndex >= items.length - 1) {
    if (loop) {
      return focusItem(items, 0, container)
    }
    return null
  }

  return focusItem(items, currentIndex + 1, container)
}

/**
 * Focus the previous item in the list
 * @param {HTMLElement[]} items - Array of focusable items
 * @param {HTMLElement} container - The root container
 * @param {boolean} loop - Whether to loop to end
 * @returns {HTMLElement|null} The newly focused item
 */
export function focusPreviousItem(items, container, loop = true) {
  if (items.length === 0) return null

  let currentIndex = findCurrentItemIndex(items)

  if (currentIndex === -1 || currentIndex === 0) {
    if (loop) {
      return focusItem(items, items.length - 1, container)
    }
    return null
  }

  return focusItem(items, currentIndex - 1, container)
}

// =============================================================================
// SUBMENU MANAGEMENT
// =============================================================================

/**
 * Check if a menu item has a submenu
 * @param {HTMLElement} menuItem - The menu item to check
 * @returns {boolean}
 */
export function hasSubmenu(menuItem) {
  if (!menuItem) return false
  const nextSibling = menuItem.nextElementSibling
  return nextSibling && nextSibling.getAttribute('role') === 'menu'
}

/**
 * Open a submenu
 * @param {HTMLElement} trigger - The submenu trigger element
 * @param {HTMLElement} submenu - The submenu element
 */
export function openSubmenu(trigger, submenu) {
  if (!submenu || submenu.getAttribute('role') !== 'menu') return

  submenu.classList.remove('hidden')
  submenu.setAttribute('data-state', 'open')
  trigger.setAttribute('data-state', 'open')

  positionSubmenu(trigger, submenu)
}

/**
 * Close a submenu and all its children
 * @param {HTMLElement} submenu - The submenu element
 * @param {HTMLElement} trigger - The submenu trigger element
 */
export function closeSubmenu(submenu, trigger) {
  if (!submenu) return

  // Close all nested submenus first
  const nestedSubmenus = submenu.querySelectorAll('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]')
  nestedSubmenus.forEach(nested => {
    nested.classList.add('hidden')
    nested.setAttribute('data-state', 'closed')
    const nestedTrigger = nested.previousElementSibling
    if (nestedTrigger) {
      nestedTrigger.setAttribute('data-state', 'closed')
    }
  })

  // Close the submenu itself
  submenu.classList.add('hidden')
  submenu.setAttribute('data-state', 'closed')
  if (trigger) {
    trigger.setAttribute('data-state', 'closed')
  }
}

/**
 * Close all submenus in a container
 * @param {HTMLElement} container - The root container
 */
export function closeAllSubmenus(container) {
  const submenus = container.querySelectorAll('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]')
  submenus.forEach(submenu => {
    submenu.classList.add('hidden')
    submenu.setAttribute('data-state', 'closed')

    const trigger = submenu.previousElementSibling
    if (trigger) {
      trigger.setAttribute('data-state', 'closed')
    }
  })
}

/**
 * Close sibling submenus (not parent or child submenus)
 * @param {HTMLElement} currentTrigger - The current trigger
 */
export function closeSiblingSubmenus(currentTrigger) {
  const parentMenu = currentTrigger.closest('[role="menu"]')
  if (!parentMenu) return

  const siblingTriggers = Array.from(parentMenu.children).filter(child => {
    return child !== currentTrigger &&
           child.classList &&
           child.classList.contains('relative')
  })

  siblingTriggers.forEach(container => {
    const trigger = container.querySelector(':scope > [role="menuitem"]')
    const submenu = trigger?.nextElementSibling
    if (submenu && submenu.getAttribute('role') === 'menu') {
      closeSubmenu(submenu, trigger)
    }
  })
}

// =============================================================================
// POSITIONING
// =============================================================================

/**
 * Position a dropdown menu relative to its trigger
 * @param {HTMLElement} trigger - The trigger element
 * @param {HTMLElement} content - The content element
 * @param {Object} options - Positioning options
 * @returns {Function} Cleanup function
 */
export function positionDropdown(trigger, content, options = {}) {
  const {
    placement = 'bottom-start',
    offsetValue = 4,
    flipEnabled = true
  } = options

  const middleware = []

  if (offsetValue > 0) {
    middleware.push(offset(offsetValue))
  }

  if (flipEnabled) {
    middleware.push(flip())
  }

  middleware.push(shift({ padding: 8 }))

  return computePosition(trigger, content, {
    placement,
    middleware,
    strategy: 'absolute'
  }).then(({ x, y, placement: finalPlacement }) => {
    Object.assign(content.style, {
      left: `${x}px`,
      top: `${y}px`,
    })

    // Update data-side and data-align attributes
    const [side, align] = finalPlacement.split('-')
    content.setAttribute('data-side', side)
    content.setAttribute('data-align', align || 'center')
  })
}

/**
 * Position a submenu relative to its trigger
 * @param {HTMLElement} trigger - The submenu trigger
 * @param {HTMLElement} submenu - The submenu content
 */
export function positionSubmenu(trigger, submenu) {
  const side = submenu.getAttribute('data-side') || 'right'
  const align = submenu.getAttribute('data-align') || 'start'
  const placement = `${side}-${align}`

  computePosition(trigger, submenu, {
    placement,
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

    const [finalSide, finalAlign] = finalPlacement.split('-')
    submenu.setAttribute('data-side', finalSide)
    submenu.setAttribute('data-align', finalAlign || 'center')
  })
}

// =============================================================================
// ROVING TABINDEX
// =============================================================================

/**
 * Update roving tabindex - set tabindex=0 on one item, -1 on all others
 * @param {HTMLElement} container - The container with all items
 * @param {HTMLElement} focusedItem - The item that should have tabindex=0
 */
export function updateRovingTabindex(container, focusedItem) {
  const allItems = container.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
  allItems.forEach(item => {
    item.setAttribute('tabindex', item === focusedItem ? '0' : '-1')
  })
}

/**
 * Clear all tabindexes (set all to -1)
 * @param {HTMLElement} container - The container with all items
 */
export function clearAllTabindexes(container) {
  const allItems = container.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
  allItems.forEach(item => {
    item.setAttribute('tabindex', '-1')
  })
}

/**
 * Get the item that currently has keyboard focus (tabindex=0)
 * @param {HTMLElement} container - The container
 * @returns {HTMLElement|null}
 */
export function getKeyboardFocusedItem(container) {
  const allItems = container.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
  return Array.from(allItems).find(item => item.getAttribute('tabindex') === '0') || null
}
