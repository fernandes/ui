import { Controller } from "@hotwired/stimulus"
import { computePosition, flip, offset, shift, autoUpdate } from "@floating-ui/dom"
import {
  getFocusableItems,
  findCurrentItemIndex,
  hasSubmenu,
  closeSubmenu as closeSubmenuUtil,
  closeAllSubmenus,
  positionDropdown,
  clearAllTabindexes,
  getKeyboardFocusedItem
} from "../utils/menu_utils.js"

/**
 * Menubar Controller
 *
 * Implements the ARIA menubar pattern with keyboard navigation.
 * Reference: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 */
export default class extends Controller {
  static targets = ["trigger", "content", "item"]
  static values = {
    open: { type: Boolean, default: false },
    activeIndex: { type: Number, default: -1 }
  }

  connect() {
    this.closeSubmenuTimeouts = new Map()
    this.submenuCleanups = new Map() // Track autoUpdate cleanups for submenus
    this.lastHoveredItem = null
    this.isMenubarActive = false

    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    document.addEventListener('click', this.boundHandleClickOutside)

    // Initialize triggers with proper tabindex
    this.initializeTriggers()
  }

  disconnect() {
    this.closeSubmenuTimeouts.forEach((timeoutId) => clearTimeout(timeoutId))
    this.closeSubmenuTimeouts.clear()
    // Cleanup all submenu autoUpdates
    this.submenuCleanups.forEach((cleanup) => cleanup())
    this.submenuCleanups.clear()
    document.removeEventListener('click', this.boundHandleClickOutside)
    document.removeEventListener('keydown', this.boundHandleKeydown)
  }

  initializeTriggers() {
    this.triggerTargets.forEach((trigger, index) => {
      trigger.setAttribute('tabindex', index === 0 ? '0' : '-1')
    })
  }

  // =========================================================================
  // MENU OPEN/CLOSE
  // =========================================================================

  toggle(event) {
    // Ignore keyboard-triggered clicks (Space/Enter) - these are handled by handleTriggerKeydown
    // Real mouse clicks have event.detail >= 1, keyboard clicks have event.detail === 0
    if (event.detail === 0) return

    const trigger = event.currentTarget
    const triggerIndex = this.triggerTargets.indexOf(trigger)
    const content = this.contentTargets[triggerIndex]

    if (!content) return

    const isCurrentlyOpen = !content.classList.contains('hidden')

    this.closeAll()

    if (!isCurrentlyOpen) {
      this.openMenu(triggerIndex)
    }
  }

  openMenu(index) {
    const trigger = this.triggerTargets[index]
    const content = this.contentTargets[index]

    if (!trigger || !content) return

    // Close all menus first (but don't teardown keyboard navigation yet)
    this.triggerTargets.forEach((t, i) => {
      const c = this.contentTargets[i]
      if (c) {
        closeAllSubmenus(c)
        c.classList.add('hidden')
        c.setAttribute('data-state', 'closed')
        clearAllTabindexes(c)
      }
      t.setAttribute('data-state', 'closed')
      t.setAttribute('aria-expanded', 'false')
      // Remove focus from previous trigger
      t.blur()
    })

    // Open the menu
    content.classList.remove('hidden')
    content.setAttribute('data-state', 'open')
    trigger.setAttribute('data-state', 'open')
    trigger.setAttribute('aria-expanded', 'true')

    this.openValue = true
    this.activeIndexValue = index
    this.isMenubarActive = true

    // Position the dropdown
    positionDropdown(trigger, content, {
      placement: 'bottom-start',
      offsetValue: 4,
      flipEnabled: true
    })

    // Setup keyboard navigation
    this.setupKeyboardNavigation()

    // Don't auto-focus first item - wait for ArrowDown key
    // Just clear tabindexes and reset lastHoveredItem
    clearAllTabindexes(content)
    this.lastHoveredItem = null
  }

  closeAll(options = {}) {
    const { returnFocus = false } = options

    // Cleanup all submenu autoUpdates
    this.submenuCleanups.forEach((cleanup) => cleanup())
    this.submenuCleanups.clear()

    this.triggerTargets.forEach((trigger, index) => {
      const content = this.contentTargets[index]
      if (content) {
        closeAllSubmenus(content)
        content.classList.add('hidden')
        content.setAttribute('data-state', 'closed')
        clearAllTabindexes(content)
      }
      trigger.setAttribute('data-state', 'closed')
      trigger.setAttribute('aria-expanded', 'false')
    })

    this.openValue = false
    this.lastHoveredItem = null
    this.teardownKeyboardNavigation()

    if (returnFocus && this.activeIndexValue >= 0) {
      const trigger = this.triggerTargets[this.activeIndexValue]
      if (trigger) {
        setTimeout(() => trigger.focus(), 50)
      }
    }
  }

  // =========================================================================
  // TRIGGER HOVER (when menubar is active, hover switches menus)
  // =========================================================================

  handleTriggerHover(event) {
    if (!this.isMenubarActive || !this.openValue) return

    const trigger = event.currentTarget
    const triggerIndex = this.triggerTargets.indexOf(trigger)

    if (triggerIndex !== this.activeIndexValue && triggerIndex >= 0) {
      this.openMenu(triggerIndex)
    }
  }

  // =========================================================================
  // MENU ITEM HOVER
  // =========================================================================

  trackHoveredItem(event) {
    const item = event.currentTarget
    const activeContent = this.contentTargets[this.activeIndexValue]
    if (!activeContent) return

    // Update tabindex and focus (this gives the accent/highlight)
    clearAllTabindexes(activeContent)
    item.setAttribute('tabindex', '0')
    item.focus()
    this.lastHoveredItem = item

    // Close sibling submenus when hovering a different item
    const parentMenu = item.closest('[role="menu"]')
    if (parentMenu) {
      this.closeSiblingSubmenus(item, parentMenu)
    }
  }

  selectItem(event) {
    const item = event.currentTarget
    const role = item.getAttribute('role')

    if (role === 'menuitemcheckbox') {
      event.stopPropagation()
      this.toggleCheckbox(item)
    } else if (role === 'menuitemradio') {
      event.stopPropagation()
      this.selectRadio(item)
    } else {
      // Regular menuitem - close menu
      this.closeAll()
      this.isMenubarActive = false
    }
  }

  // =========================================================================
  // SUBMENU HOVER HANDLERS
  // =========================================================================

  openSubmenu(event) {
    const trigger = event.currentTarget
    const submenu = trigger.nextElementSibling
    const activeContent = this.contentTargets[this.activeIndexValue]

    if (!submenu || submenu.getAttribute('role') !== 'menu') return

    // Cancel any pending close timeout
    if (this.closeSubmenuTimeouts.has(trigger)) {
      clearTimeout(this.closeSubmenuTimeouts.get(trigger))
      this.closeSubmenuTimeouts.delete(trigger)
    }

    // Update tabindex and focus (give accent to submenu trigger)
    if (activeContent) {
      clearAllTabindexes(activeContent)
      trigger.setAttribute('tabindex', '0')
      trigger.focus()
      this.lastHoveredItem = trigger
    }

    // Close sibling submenus
    const parentMenu = trigger.closest('[role="menu"]')
    if (parentMenu) {
      this.closeSiblingSubmenus(trigger, parentMenu)
    }

    // Open this submenu with autoUpdate for proper positioning
    this.openSubmenuWithAutoUpdate(trigger, submenu)
  }

  // Open submenu with autoUpdate to ensure correct positioning from first render
  openSubmenuWithAutoUpdate(trigger, submenu) {
    if (!submenu || submenu.getAttribute('role') !== 'menu') return

    // Cleanup any existing autoUpdate for this submenu
    if (this.submenuCleanups.has(submenu)) {
      this.submenuCleanups.get(submenu)()
      this.submenuCleanups.delete(submenu)
    }

    submenu.classList.remove('hidden')
    submenu.setAttribute('data-state', 'open')
    trigger.setAttribute('data-state', 'open')

    const side = submenu.getAttribute('data-side') || 'right'
    const align = submenu.getAttribute('data-align') || 'start'
    const placement = `${side}-${align}`

    const update = () => {
      computePosition(trigger, submenu, {
        placement,
        middleware: [
          offset(4),
          flip({ fallbackPlacements: ['left-start'] }),
          shift({ padding: 8 })
        ],
        strategy: 'fixed'
      }).then(({ x, y, placement: finalPlacement }) => {
        Object.assign(submenu.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
        })

        const [finalSide, finalAlign] = finalPlacement.split('-')
        submenu.setAttribute('data-side', finalSide)
        submenu.setAttribute('data-align', finalAlign || 'start')
      })
    }

    // Use autoUpdate to keep position synchronized
    const cleanup = autoUpdate(trigger, submenu, update, {
      ancestorScroll: true,
      ancestorResize: true,
      elementResize: true,
      layoutShift: true,
      animationFrame: true
    })

    this.submenuCleanups.set(submenu, cleanup)
  }

  // Close submenu and cleanup autoUpdate
  closeSubmenuAndCleanup(submenu, trigger) {
    if (!submenu) return

    // Cleanup autoUpdate
    if (this.submenuCleanups.has(submenu)) {
      this.submenuCleanups.get(submenu)()
      this.submenuCleanups.delete(submenu)
    }

    // Close nested submenus first
    const nestedSubmenus = submenu.querySelectorAll('[role="menu"][data-side="right"], [role="menu"][data-side="right-start"]')
    nestedSubmenus.forEach(nested => {
      if (this.submenuCleanups.has(nested)) {
        this.submenuCleanups.get(nested)()
        this.submenuCleanups.delete(nested)
      }
      nested.classList.add('hidden')
      nested.setAttribute('data-state', 'closed')
      const nestedTrigger = nested.previousElementSibling
      if (nestedTrigger) {
        nestedTrigger.setAttribute('data-state', 'closed')
      }
    })

    submenu.classList.add('hidden')
    submenu.setAttribute('data-state', 'closed')
    if (trigger) {
      trigger.setAttribute('data-state', 'closed')
    }
  }

  closeSubmenu(event) {
    const trigger = event.currentTarget
    const submenu = trigger.nextElementSibling
    const relatedTarget = event.relatedTarget

    if (!submenu || submenu.getAttribute('role') !== 'menu') return

    // Don't close if moving to the submenu
    if (relatedTarget && submenu.contains(relatedTarget)) {
      return
    }

    // Delay close
    const timeoutId = setTimeout(() => {
      this.closeSubmenuAndCleanup(submenu, trigger)
      this.closeSubmenuTimeouts.delete(trigger)
    }, 300)

    this.closeSubmenuTimeouts.set(trigger, timeoutId)
  }

  cancelSubmenuClose(event) {
    const submenu = event.currentTarget
    const trigger = submenu.previousElementSibling

    if (trigger && this.closeSubmenuTimeouts.has(trigger)) {
      clearTimeout(this.closeSubmenuTimeouts.get(trigger))
      this.closeSubmenuTimeouts.delete(trigger)
    }
  }

  closeSiblingSubmenus(currentItem, parentMenu) {
    Array.from(parentMenu.children).forEach(child => {
      if (child.classList && child.classList.contains('relative')) {
        const trigger = child.querySelector(':scope > [role="menuitem"]')
        const submenu = trigger?.nextElementSibling
        if (trigger !== currentItem && submenu && submenu.getAttribute('role') === 'menu') {
          this.closeSubmenuAndCleanup(submenu, trigger)
        }
      }
    })
  }

  // =========================================================================
  // CLICK OUTSIDE
  // =========================================================================

  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.closeAll()
      this.isMenubarActive = false
    }
  }

  // =========================================================================
  // KEYBOARD NAVIGATION
  // =========================================================================

  setupKeyboardNavigation() {
    document.addEventListener('keydown', this.boundHandleKeydown)
  }

  teardownKeyboardNavigation() {
    document.removeEventListener('keydown', this.boundHandleKeydown)
  }

  handleKeydown(event) {
    // Handle navigation on triggers when menu is closed
    if (!this.openValue) {
      const isTrigger = this.triggerTargets.includes(event.target)
      if (isTrigger) {
        this.handleTriggerKeydown(event)
      }
      return
    }

    const activeContent = this.contentTargets[this.activeIndexValue]
    if (!activeContent) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.focusNextMenuItem()
        break

      case 'ArrowUp':
        event.preventDefault()
        this.focusPreviousMenuItem()
        break

      case 'ArrowRight':
        event.preventDefault()
        this.handleArrowRight()
        break

      case 'ArrowLeft':
        event.preventDefault()
        this.handleArrowLeft()
        break

      case 'Home':
        event.preventDefault()
        this.focusFirstMenuItem()
        break

      case 'End':
        event.preventDefault()
        this.focusLastMenuItem()
        break

      case 'Escape':
        event.preventDefault()
        if (!this.closeCurrentSubmenu()) {
          this.closeAll({ returnFocus: true })
        }
        break

      case 'Enter':
      case ' ':
        event.preventDefault()
        this.activateCurrentItem()
        break

      case 'Tab':
        this.closeAll()
        this.isMenubarActive = false
        break
    }
  }

  handleTriggerKeydown(event) {
    const trigger = event.currentTarget
    const triggerIndex = this.triggerTargets.indexOf(trigger)

    // Only handle if this is a valid trigger
    if (triggerIndex === -1) return

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        this.focusNextTrigger(triggerIndex)
        break

      case 'ArrowLeft':
        event.preventDefault()
        this.focusPreviousTrigger(triggerIndex)
        break

      case 'ArrowDown':
      case 'Enter':
      case ' ':
        event.preventDefault()
        event.stopPropagation()
        this.openMenu(triggerIndex)
        break

      case 'Home':
        event.preventDefault()
        this.focusTrigger(0)
        break

      case 'End':
        event.preventDefault()
        this.focusTrigger(this.triggerTargets.length - 1)
        break
    }
  }

  handleArrowRight() {
    const activeContent = this.contentTargets[this.activeIndexValue]
    const currentItem = getKeyboardFocusedItem(activeContent) || this.lastHoveredItem

    // If current item has submenu, open it
    if (currentItem && hasSubmenu(currentItem)) {
      this.openSubmenuWithKeyboard(currentItem)
    } else {
      // Move to next menu in menubar
      this.navigateToNextMenu()
    }
  }

  handleArrowLeft() {
    // If in a submenu, close it
    if (!this.closeCurrentSubmenu()) {
      // Move to previous menu in menubar
      this.navigateToPreviousMenu()
    }
  }

  // =========================================================================
  // TRIGGER NAVIGATION
  // =========================================================================

  focusNextTrigger(currentIndex) {
    const nextIndex = (currentIndex + 1) % this.triggerTargets.length
    this.focusTrigger(nextIndex)
  }

  focusPreviousTrigger(currentIndex) {
    const prevIndex = currentIndex === 0 ? this.triggerTargets.length - 1 : currentIndex - 1
    this.focusTrigger(prevIndex)
  }

  focusTrigger(index) {
    this.triggerTargets.forEach((t, i) => {
      t.setAttribute('tabindex', i === index ? '0' : '-1')
    })
    this.triggerTargets[index].focus()
  }

  navigateToNextMenu() {
    const nextIndex = (this.activeIndexValue + 1) % this.triggerTargets.length
    this.openMenu(nextIndex)
  }

  navigateToPreviousMenu() {
    const prevIndex = this.activeIndexValue === 0 ?
      this.triggerTargets.length - 1 :
      this.activeIndexValue - 1
    this.openMenu(prevIndex)
  }

  // =========================================================================
  // MENU ITEM NAVIGATION
  // =========================================================================

  getDirectMenuItems(menu) {
    const items = []
    Array.from(menu.children).forEach(child => {
      const role = child.getAttribute('role')
      if (role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio') {
        if (!child.hasAttribute('data-disabled')) {
          items.push(child)
        }
      } else if (role === 'group') {
        const radioItems = child.querySelectorAll('[role="menuitemradio"]')
        radioItems.forEach(item => {
          if (!item.hasAttribute('data-disabled')) {
            items.push(item)
          }
        })
      } else if (child.classList && child.classList.contains('relative')) {
        const trigger = child.querySelector(':scope > [role="menuitem"]')
        if (trigger && !trigger.hasAttribute('data-disabled')) {
          items.push(trigger)
        }
      }
    })
    return items
  }

  getCurrentMenuItems() {
    const activeContent = this.contentTargets[this.activeIndexValue]
    if (!activeContent) return []

    // Find which menu we're currently in
    const currentItem = getKeyboardFocusedItem(activeContent) || this.lastHoveredItem
    let currentMenu

    if (currentItem) {
      currentMenu = currentItem.closest('[role="menu"]')
    } else {
      // activeContent itself has role="menu", so use it directly
      currentMenu = activeContent.getAttribute('role') === 'menu' ? activeContent : activeContent.querySelector('[role="menu"]')
    }

    if (!currentMenu) return []

    return this.getDirectMenuItems(currentMenu)
  }

  focusMenuItem(item, content) {
    if (!item) return

    content = content || this.contentTargets[this.activeIndexValue]
    if (!content) return

    clearAllTabindexes(content)
    item.setAttribute('tabindex', '0')
    item.focus()
    this.lastHoveredItem = item

    // Close sibling submenus when navigating with keyboard
    const parentMenu = item.closest('[role="menu"]')
    if (parentMenu) {
      this.closeSiblingSubmenus(item, parentMenu)
    }
  }

  focusNextMenuItem() {
    const items = this.getCurrentMenuItems()
    if (items.length === 0) return

    const currentItem = getKeyboardFocusedItem(this.contentTargets[this.activeIndexValue]) || this.lastHoveredItem
    let currentIndex = currentItem ? items.indexOf(currentItem) : -1

    const nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1
    this.focusMenuItem(items[nextIndex])
  }

  focusPreviousMenuItem() {
    const items = this.getCurrentMenuItems()
    if (items.length === 0) return

    const currentItem = getKeyboardFocusedItem(this.contentTargets[this.activeIndexValue]) || this.lastHoveredItem
    let currentIndex = currentItem ? items.indexOf(currentItem) : -1

    const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1
    this.focusMenuItem(items[prevIndex])
  }

  focusFirstMenuItem() {
    const items = this.getCurrentMenuItems()
    if (items.length > 0) {
      this.focusMenuItem(items[0])
    }
  }

  focusLastMenuItem() {
    const items = this.getCurrentMenuItems()
    if (items.length > 0) {
      this.focusMenuItem(items[items.length - 1])
    }
  }

  // =========================================================================
  // SUBMENU KEYBOARD
  // =========================================================================

  openSubmenuWithKeyboard(trigger) {
    const submenu = trigger.nextElementSibling
    if (!submenu || submenu.getAttribute('role') !== 'menu') return

    const activeContent = this.contentTargets[this.activeIndexValue]

    // Close sibling submenus
    const parentMenu = trigger.closest('[role="menu"]')
    if (parentMenu) {
      this.closeSiblingSubmenus(trigger, parentMenu)
    }

    // Open submenu with autoUpdate
    this.openSubmenuWithAutoUpdate(trigger, submenu)

    // Focus first item in submenu
    const submenuItems = this.getDirectMenuItems(submenu)
    if (submenuItems.length > 0 && activeContent) {
      clearAllTabindexes(activeContent)
      submenuItems[0].setAttribute('tabindex', '0')
      submenuItems[0].focus()
      this.lastHoveredItem = submenuItems[0]
    }
  }

  closeCurrentSubmenu() {
    const activeContent = this.contentTargets[this.activeIndexValue]
    if (!activeContent) return false

    const currentItem = getKeyboardFocusedItem(activeContent) || this.lastHoveredItem
    if (!currentItem) return false

    const parentMenu = currentItem.closest('[role="menu"]')
    if (!parentMenu) return false

    // Check if we're in a submenu (has data-side="right")
    const dataSide = parentMenu.getAttribute('data-side')
    if (dataSide === 'right' || dataSide === 'right-start') {
      const trigger = parentMenu.previousElementSibling

      this.closeSubmenuAndCleanup(parentMenu, trigger)

      if (trigger) {
        clearAllTabindexes(activeContent)
        trigger.setAttribute('tabindex', '0')
        trigger.focus()
        this.lastHoveredItem = trigger
      }

      return true
    }

    return false
  }

  // =========================================================================
  // ITEM ACTIVATION
  // =========================================================================

  activateCurrentItem() {
    const activeContent = this.contentTargets[this.activeIndexValue]
    if (!activeContent) return

    const currentItem = getKeyboardFocusedItem(activeContent) || this.lastHoveredItem
    if (!currentItem) return

    const role = currentItem.getAttribute('role')

    if (role === 'menuitem') {
      if (hasSubmenu(currentItem)) {
        this.openSubmenuWithKeyboard(currentItem)
      } else {
        currentItem.click()
        this.closeAll()
        this.isMenubarActive = false
      }
    } else if (role === 'menuitemcheckbox') {
      this.toggleCheckbox(currentItem)
    } else if (role === 'menuitemradio') {
      this.selectRadio(currentItem)
    }
  }

  // =========================================================================
  // CHECKBOX / RADIO
  // =========================================================================

  toggleCheckbox(item) {
    if (item.getAttribute('role') !== 'menuitemcheckbox') return

    const currentState = item.getAttribute('data-state')
    const newState = currentState === 'checked' ? 'unchecked' : 'checked'
    const isChecked = newState === 'checked'

    item.setAttribute('data-state', newState)
    item.setAttribute('aria-checked', isChecked)

    const iconContainer = item.querySelector('.absolute.left-2') ||
                          item.querySelector('span.absolute')
    if (iconContainer) {
      iconContainer.innerHTML = isChecked ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
      ` : ''
    }
  }

  selectRadio(item) {
    if (item.getAttribute('role') !== 'menuitemradio') return

    const radioGroup = item.closest('[role="group"]') || item.closest('[role="menu"]')
    if (!radioGroup) return

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

    item.setAttribute('data-state', 'checked')
    item.setAttribute('aria-checked', 'true')

    const iconContainer = item.querySelector('.absolute.left-2') ||
                          item.querySelector('span.absolute')
    if (iconContainer) {
      iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-2">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      `
    }
  }
}
