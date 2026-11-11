/**
 * Menu Utilities
 *
 * Shared by the Dropdown Menu, Context Menu and Menubar controllers: item
 * queries, roving focus, disabled items, typeahead, checkbox/radio state and
 * submenus (with their ARIA: aria-haspopup / aria-expanded / aria-controls).
 *
 * Structure the helpers rely on (what the Ruby components render):
 *
 *   [role=menu]                       ← a menu (content or sub content)
 *     [role=menuitem]                 ← item
 *     [role=group] > [role=menuitemradio]
 *     div (Sub wrapper)
 *       [role=menuitem]               ← sub trigger
 *       [role=menu]                   ← its submenu (next sibling)
 *
 * A submenu is any [role=menu] nested inside another [role=menu]; nothing
 * depends on `data-side`, which Floating UI rewrites when the submenu flips.
 */

import { computePosition, flip, offset, shift } from "@floating-ui/dom"
import { ensureId, setIdRefs } from "./id-manager.js"

export const MENU_ITEM_SELECTOR = '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'

// =============================================================================
// ITEM STATE
// =============================================================================

/**
 * Whether a menu item is disabled (`data-disabled` or `aria-disabled="true"`).
 * @param {HTMLElement} item
 * @returns {boolean}
 */
export function isItemDisabled(item) {
  if (!item) return true
  return item.hasAttribute('data-disabled') || item.getAttribute('aria-disabled') === 'true'
}

/**
 * Whether keyboard events from this element belong to a text field (an input
 * inside a menu, e.g. a Command search in a submenu), so the menu must leave
 * Space, Home/End, ←/→ and printable keys alone.
 * @param {EventTarget} element
 * @returns {boolean}
 */
export function isEditableTarget(element) {
  if (!element || element.nodeType !== 1) return false
  if (element.isContentEditable) return true
  const tag = element.tagName
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (tag !== 'INPUT') return false
  const type = (element.getAttribute('type') || 'text').toLowerCase()
  return !['button', 'checkbox', 'radio', 'submit', 'reset', 'image', 'range', 'color', 'file'].includes(type)
}

// =============================================================================
// CHECKBOX / RADIO MANAGEMENT
// =============================================================================

const CHECK_ICON = `<span data-state="checked"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check size-4" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg></span>`
const RADIO_ICON = `<span data-state="checked"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle size-2 fill-current" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle></svg></span>`

function indicatorContainer(item) {
  return item.querySelector('.absolute.left-2') || item.querySelector('span.absolute')
}

/**
 * Toggle checkbox state on a menuitemcheckbox element
 * @param {HTMLElement} item - The checkbox item element
 * @returns {boolean} The new checked state
 */
export function toggleCheckbox(item) {
  if (!item || item.getAttribute('role') !== 'menuitemcheckbox') return false
  if (isItemDisabled(item)) return item.getAttribute('aria-checked') === 'true'

  const isChecked = item.getAttribute('aria-checked') !== 'true' && item.getAttribute('data-state') !== 'checked'

  item.setAttribute('data-state', isChecked ? 'checked' : 'unchecked')
  item.setAttribute('aria-checked', String(isChecked))

  const iconContainer = indicatorContainer(item)
  if (iconContainer) iconContainer.innerHTML = isChecked ? CHECK_ICON : ''

  return isChecked
}

/**
 * Select a radio item, deselecting others in the same group
 * @param {HTMLElement} item - The radio item to select
 * @returns {void}
 */
export function selectRadio(item) {
  if (!item || item.getAttribute('role') !== 'menuitemradio') return
  if (isItemDisabled(item)) return

  const radioGroup = item.closest('[role="group"]') || item.closest('[role="menu"]')
  if (!radioGroup) return

  radioGroup.querySelectorAll('[role="menuitemradio"]').forEach(radio => {
    radio.setAttribute('data-state', 'unchecked')
    radio.setAttribute('aria-checked', 'false')
    const iconContainer = indicatorContainer(radio)
    if (iconContainer) iconContainer.innerHTML = ''
  })

  item.setAttribute('data-state', 'checked')
  item.setAttribute('aria-checked', 'true')

  const iconContainer = indicatorContainer(item)
  if (iconContainer) iconContainer.innerHTML = RADIO_ICON
}

// =============================================================================
// ITEM NAVIGATION
// =============================================================================

/**
 * The items that belong to `menu` itself (not to its submenus), in DOM order:
 * direct items, radio items in groups and sub triggers, wherever they are
 * nested, skipping disabled ones.
 * @param {HTMLElement} menu - a [role=menu]
 * @param {{includeDisabled?: boolean}} options
 * @returns {HTMLElement[]}
 */
export function getMenuItems(menu, { includeDisabled = false } = {}) {
  if (!menu) return []
  return Array.from(menu.querySelectorAll(MENU_ITEM_SELECTOR)).filter(item =>
    item.closest('[role="menu"]') === menu && (includeDisabled || !isItemDisabled(item))
  )
}

/**
 * Get all focusable items in a menu container
 * @param {HTMLElement} container - The menu container
 * @param {HTMLElement|null} currentMenu - Optional specific menu to search in
 * @returns {HTMLElement[]} Array of focusable items
 */
export function getFocusableItems(container, currentMenu = null) {
  if (!currentMenu) {
    const currentItem = getKeyboardFocusedItem(container)
    if (currentItem) currentMenu = currentItem.closest('[role="menu"]')
  }

  return getMenuItems(currentMenu)
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

  const targetItem = items[index]
  updateRovingTabindex(container, targetItem)
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

  const currentIndex = findCurrentItemIndex(items)

  if (currentIndex === -1 || currentIndex >= items.length - 1) {
    if (loop || currentIndex === -1) return focusItem(items, 0, container)
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

  const currentIndex = findCurrentItemIndex(items)

  if (currentIndex === -1 || currentIndex === 0) {
    if (loop || currentIndex === -1) return focusItem(items, items.length - 1, container)
    return null
  }

  return focusItem(items, currentIndex - 1, container)
}

// =============================================================================
// TYPEAHEAD (X7)
// =============================================================================

// Lives in typeahead.js (Select uses it too); re-exported for menu callers.
export { getItemTextValue, createTypeahead, findTypeaheadMatch } from './typeahead.js'

// =============================================================================
// SUBMENU MANAGEMENT
// =============================================================================

/**
 * The submenu a sub trigger opens (its next sibling [role=menu]), or null.
 * @param {HTMLElement} trigger
 * @returns {HTMLElement|null}
 */
export function getSubmenu(trigger) {
  const next = trigger?.nextElementSibling
  return next && next.getAttribute('role') === 'menu' ? next : null
}

/**
 * Check if a menu item has a submenu
 * @param {HTMLElement} menuItem - The menu item to check
 * @returns {boolean}
 */
export function hasSubmenu(menuItem) {
  return !!getSubmenu(menuItem)
}

/**
 * Whether `menu` is a submenu (a [role=menu] nested in another one).
 * @param {HTMLElement} menu
 * @returns {boolean}
 */
export function isSubmenu(menu) {
  return !!(menu && menu.getAttribute('role') === 'menu' && menu.parentElement?.closest('[role="menu"]'))
}

/**
 * The sub trigger that opens `submenu`, or null when it is a top-level menu.
 * @param {HTMLElement} submenu
 * @returns {HTMLElement|null}
 */
export function getSubmenuTrigger(submenu) {
  if (!isSubmenu(submenu)) return null
  const trigger = submenu.previousElementSibling
  return trigger && trigger.matches(MENU_ITEM_SELECTOR) ? trigger : null
}

/**
 * Wire every sub trigger inside `container`: aria-haspopup="menu",
 * aria-expanded and aria-controls → its submenu (which gets an id and is
 * labelled by the trigger). Idempotent.
 * @param {HTMLElement} container
 * @param {string} prefix - id prefix, e.g. "dropdown-menu"
 */
export function initSubmenuTriggers(container, prefix = "menu") {
  container.querySelectorAll('[role="menu"] [role="menu"]').forEach(submenu => {
    const trigger = getSubmenuTrigger(submenu)
    if (!trigger) return
    ensureId(submenu, `${prefix}-sub-content`)
    trigger.setAttribute('aria-haspopup', 'menu')
    trigger.setAttribute('aria-expanded', String(submenu.getAttribute('data-state') === 'open'))
    setIdRefs(trigger, 'aria-controls', submenu, { prefix: `${prefix}-sub-trigger` })
    setIdRefs(submenu, 'aria-labelledby', trigger, { prefix: `${prefix}-sub-trigger` })
  })
}

/**
 * Open a submenu
 * @param {HTMLElement} trigger - The submenu trigger element
 * @param {HTMLElement} submenu - The submenu element
 * @param {{position?: boolean}} options - position with Floating UI (default true)
 */
export function openSubmenu(trigger, submenu, { position = true } = {}) {
  if (!submenu || submenu.getAttribute('role') !== 'menu') return
  if (isItemDisabled(trigger)) return

  submenu.classList.remove('hidden')
  submenu.setAttribute('data-state', 'open')
  trigger.setAttribute('data-state', 'open')
  trigger.setAttribute('aria-expanded', 'true')

  if (position) positionSubmenu(trigger, submenu)
}

function markClosed(submenu, trigger) {
  submenu.classList.add('hidden')
  submenu.setAttribute('data-state', 'closed')
  if (trigger) {
    trigger.setAttribute('data-state', 'closed')
    if (trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'false')
  }
}

/**
 * Close a submenu and all its children
 * @param {HTMLElement} submenu - The submenu element
 * @param {HTMLElement} trigger - The submenu trigger element
 * @param {Function} onClose - optional callback per closed submenu (cleanup)
 */
export function closeSubmenu(submenu, trigger, onClose = null) {
  if (!submenu) return

  submenu.querySelectorAll('[role="menu"]').forEach(nested => {
    markClosed(nested, getSubmenuTrigger(nested))
    if (onClose) onClose(nested)
  })

  markClosed(submenu, trigger || getSubmenuTrigger(submenu))
  if (onClose) onClose(submenu)
}

/**
 * Close all submenus in a container
 * @param {HTMLElement} container - The root container
 * @param {Function} onClose - optional callback per closed submenu (cleanup)
 */
export function closeAllSubmenus(container, onClose = null) {
  container.querySelectorAll('[role="menu"] [role="menu"]').forEach(submenu => {
    markClosed(submenu, getSubmenuTrigger(submenu))
    if (onClose) onClose(submenu)
  })
}

/**
 * Close the open submenus of `menu` other than the one `currentItem` opens.
 * @param {HTMLElement} currentItem - item in `menu` that keeps its submenu
 * @param {HTMLElement} menu - defaults to currentItem's menu
 * @param {Function} onClose - optional callback per closed submenu
 */
export function closeSiblingSubmenus(currentItem, menu = null, onClose = null) {
  const parentMenu = menu || currentItem.closest('[role="menu"]')
  if (!parentMenu) return

  getMenuItems(parentMenu, { includeDisabled: true }).forEach(item => {
    if (item === currentItem) return
    const submenu = getSubmenu(item)
    if (submenu && submenu.getAttribute('data-state') === 'open') closeSubmenu(submenu, item, onClose)
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
 * @returns {Promise}
 */
export function positionDropdown(trigger, content, options = {}) {
  const {
    placement = 'bottom-start',
    offsetValue = 4,
    flipEnabled = true
  } = options

  const middleware = []
  if (offsetValue > 0) middleware.push(offset(offsetValue))
  if (flipEnabled) middleware.push(flip())
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

    const [side, align] = finalPlacement.split('-')
    content.setAttribute('data-side', side)
    content.setAttribute('data-align', align || 'center')
  })
}

/**
 * Position a submenu relative to its trigger. The requested side comes from
 * `data-preferred-side` (set on first open from the rendered `data-side`), so
 * a submenu that flipped once still asks for its original side next time.
 * @param {HTMLElement} trigger - The submenu trigger
 * @param {HTMLElement} submenu - The submenu content
 */
export function positionSubmenu(trigger, submenu) {
  if (!submenu.dataset.preferredSide) submenu.dataset.preferredSide = submenu.getAttribute('data-side') || 'right'
  const side = submenu.dataset.preferredSide
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
  container.querySelectorAll(MENU_ITEM_SELECTOR).forEach(item => {
    item.setAttribute('tabindex', item === focusedItem ? '0' : '-1')
  })
}

/**
 * Clear all tabindexes (set all to -1)
 * @param {HTMLElement} container - The container with all items
 */
export function clearAllTabindexes(container) {
  container.querySelectorAll(MENU_ITEM_SELECTOR).forEach(item => {
    item.setAttribute('tabindex', '-1')
  })
}

/**
 * Get the item that currently has keyboard focus (tabindex=0)
 * @param {HTMLElement} container - The container
 * @returns {HTMLElement|null}
 */
export function getKeyboardFocusedItem(container) {
  if (!container) return null
  return Array.from(container.querySelectorAll(MENU_ITEM_SELECTOR)).find(item => item.getAttribute('tabindex') === '0') || null
}
