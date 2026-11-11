import { Controller } from "@hotwired/stimulus"
import { computePosition, flip, offset, shift, autoUpdate } from "@floating-ui/dom"
import {
  MENU_ITEM_SELECTOR,
  getMenuItems,
  hasSubmenu,
  getSubmenu,
  getSubmenuTrigger,
  initSubmenuTriggers,
  closeSubmenu as closeSubmenuUtil,
  closeAllSubmenus,
  closeSiblingSubmenus as closeSiblingSubmenusUtil,
  positionDropdown,
  clearAllTabindexes,
  getKeyboardFocusedItem,
  isItemDisabled,
  isEditableTarget,
  createTypeahead,
  toggleCheckbox as toggleCheckboxUtil,
  selectRadio as selectRadioUtil
} from "../utils/menu_utils.js"
import { ensureId, setIdRefs } from "../utils/id-manager.js"
import { createEscapeLayer } from "../utils/escape-key-manager.js"

/**
 * Menubar Controller
 *
 * Implements the ARIA menubar pattern with keyboard navigation.
 * Reference: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 *
 * - Triggers use a roving tabindex (one tab stop); ←/→ move between them.
 * - Enter/Space/ArrowDown open a menu on its first item, ArrowUp on its last;
 *   a pointer click opens it with focus on the menu itself.
 * - In a menu: arrows, Home/End, typeahead, ←/→ switch menus or close/open
 *   submenus. Disabled items are skipped.
 * - Escape (shared layer stack) closes the innermost submenu, then the menu;
 *   Escape, selecting an item and Tab return focus to the menu's trigger.
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
    this.typeahead = createTypeahead()

    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    this.boundCleanupSubmenu = this.cleanupSubmenu.bind(this)
    document.addEventListener('click', this.boundHandleClickOutside)
    // Menu keys are handled on the menubar only, never page-wide
    this.element.addEventListener('keydown', this.boundHandleKeydown)

    this.escapeLayer = createEscapeLayer(() => this.handleEscape(), { element: this.element })

    this.resetToClosed()
    this.initializeTriggers()
    this.setupAria()
  }

  disconnect() {
    this.closeSubmenuTimeouts.forEach((timeoutId) => clearTimeout(timeoutId))
    this.closeSubmenuTimeouts.clear()
    this.submenuCleanups.forEach((cleanup) => cleanup())
    this.submenuCleanups.clear()
    this.escapeLayer?.deactivate()
    this.typeahead?.reset()
    clearTimeout(this.ignoreClickTimer)
    document.removeEventListener('click', this.boundHandleClickOutside)
    this.element.removeEventListener('keydown', this.boundHandleKeydown)
  }

  initializeTriggers() {
    this.triggerTargets.forEach((trigger, index) => {
      trigger.setAttribute('tabindex', index === 0 ? '0' : '-1')
    })
  }

  // Trigger ↔ menu ids: aria-controls on the trigger, the menu labelled by it.
  setupAria() {
    this.triggerTargets.forEach((trigger, index) => {
      const content = this.contentTargets[index]
      trigger.setAttribute('aria-haspopup', 'menu')
      if (!content) return
      ensureId(content, 'menubar-content')
      trigger.setAttribute('aria-expanded', String(content.getAttribute('data-state') === 'open'))
      setIdRefs(trigger, 'aria-controls', content, { prefix: 'menubar-trigger' })
      setIdRefs(content, 'aria-labelledby', trigger, { prefix: 'menubar-trigger' })
    })
    initSubmenuTriggers(this.element, 'menubar')
  }

  // A Turbo snapshot taken while a menu was open restores it open with no
  // live state behind it: start every connect closed.
  resetToClosed() {
    this.contentTargets.forEach((content, index) => {
      if (content.getAttribute('data-state') !== 'open') return
      closeAllSubmenus(content)
      content.classList.add('hidden')
      content.setAttribute('data-state', 'closed')
      clearAllTabindexes(content)
      const trigger = this.triggerTargets[index]
      if (trigger) {
        trigger.setAttribute('data-state', 'closed')
        trigger.setAttribute('aria-expanded', 'false')
      }
    })
    this.openValue = false
  }

  get activeContent() {
    return this.contentTargets[this.activeIndexValue] || null
  }

  // =========================================================================
  // MENU OPEN/CLOSE
  // =========================================================================

  // click on a trigger. Pointer clicks open with focus on the menu; virtual
  // clicks (screen readers, element.click(): detail 0) open on the first item,
  // like the keyboard. Enter/Space are handled in handleTriggerKeydown.
  toggle(event) {
    if (this.ignoreNextClick) {
      this.ignoreNextClick = false
      return
    }

    const trigger = event.currentTarget
    const triggerIndex = this.triggerTargets.indexOf(trigger)
    const content = this.contentTargets[triggerIndex]
    if (!content) return

    const isCurrentlyOpen = content.getAttribute('data-state') === 'open'

    if (isCurrentlyOpen) {
      this.closeAll()
      this.focusTrigger(triggerIndex)
    } else {
      this.openMenu(triggerIndex, { focus: event.detail === 0 ? 'first' : 'content' })
    }
  }

  openMenu(index, { focus = 'content' } = {}) {
    const trigger = this.triggerTargets[index]
    const content = this.contentTargets[index]

    if (!trigger || !content) return

    // Close the other menus (keyboard navigation stays set up)
    this.triggerTargets.forEach((t, i) => {
      const c = this.contentTargets[i]
      if (c && c !== content) {
        closeAllSubmenus(c, this.boundCleanupSubmenu)
        c.classList.add('hidden')
        c.setAttribute('data-state', 'closed')
        clearAllTabindexes(c)
      }
      if (t !== trigger) {
        t.setAttribute('data-state', 'closed')
        t.setAttribute('aria-expanded', 'false')
      }
    })

    content.classList.remove('hidden')
    content.setAttribute('data-state', 'open')
    trigger.setAttribute('data-state', 'open')
    trigger.setAttribute('aria-expanded', 'true')

    this.openValue = true
    this.activeIndexValue = index
    this.isMenubarActive = true
    this.typeahead.reset()
    this.setTriggerTabindex(index)

    positionDropdown(trigger, content, {
      placement: 'bottom-start',
      offsetValue: 4,
      flipEnabled: true
    })

    this.escapeLayer.activate()

    clearAllTabindexes(content)
    this.lastHoveredItem = null

    if (focus === 'first') this.focusFirstMenuItem()
    else if (focus === 'last') this.focusLastMenuItem()
    else if (focus === 'content') content.focus()
  }

  closeAll(options = {}) {
    const { returnFocus = false } = options
    const wasOpen = this.openValue

    this.escapeLayer?.deactivate()
    this.typeahead?.reset()

    // Move focus to the trigger before hiding the menu, so it never drops to <body>
    if (returnFocus && wasOpen && this.activeIndexValue >= 0) {
      this.focusTrigger(this.activeIndexValue)
    }

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
    this.isMenubarActive = false
    this.lastHoveredItem = null
  }

  handleEscape() {
    if (!this.closeCurrentSubmenu()) {
      this.closeAll({ returnFocus: true })
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
      this.openMenu(triggerIndex, { focus: 'content' })
    }
  }

  // =========================================================================
  // MENU ITEM HOVER / CLICK
  // =========================================================================

  trackHoveredItem(event) {
    const item = event.currentTarget
    const activeContent = this.activeContent
    if (!activeContent || isItemDisabled(item)) return

    clearAllTabindexes(activeContent)
    item.setAttribute('tabindex', '0')
    item.focus()
    this.lastHoveredItem = item

    const parentMenu = item.closest('[role="menu"]')
    if (parentMenu) this.closeSiblingSubmenus(item, parentMenu)
  }

  selectItem(event) {
    const item = event.currentTarget
    if (isItemDisabled(item)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }

    const role = item.getAttribute('role')

    if (role === 'menuitemcheckbox') {
      event.stopPropagation()
      this.toggleCheckbox(item)
    } else if (role === 'menuitemradio') {
      event.stopPropagation()
      this.selectRadio(item)
    } else if (!hasSubmenu(item)) {
      this.closeAll({ returnFocus: true })
    }
  }

  // =========================================================================
  // SUBMENU HOVER HANDLERS
  // =========================================================================

  openSubmenu(event) {
    const trigger = event.currentTarget
    const submenu = getSubmenu(trigger)
    const activeContent = this.activeContent

    if (!submenu || isItemDisabled(trigger)) return

    if (this.closeSubmenuTimeouts.has(trigger)) {
      clearTimeout(this.closeSubmenuTimeouts.get(trigger))
      this.closeSubmenuTimeouts.delete(trigger)
    }

    if (activeContent) {
      clearAllTabindexes(activeContent)
      trigger.setAttribute('tabindex', '0')
      trigger.focus()
      this.lastHoveredItem = trigger
    }

    const parentMenu = trigger.closest('[role="menu"]')
    if (parentMenu) this.closeSiblingSubmenus(trigger, parentMenu)

    this.openSubmenuWithAutoUpdate(trigger, submenu)
  }

  // Open submenu with autoUpdate to ensure correct positioning from first render
  openSubmenuWithAutoUpdate(trigger, submenu) {
    if (!submenu || submenu.getAttribute('role') !== 'menu') return

    this.cleanupSubmenu(submenu)

    submenu.classList.remove('hidden')
    submenu.setAttribute('data-state', 'open')
    trigger.setAttribute('data-state', 'open')
    trigger.setAttribute('aria-expanded', 'true')

    // Ask for the rendered side every time: data-side is rewritten when the
    // submenu flips, and must not stick.
    if (!submenu.dataset.preferredSide) submenu.dataset.preferredSide = submenu.getAttribute('data-side') || 'right'
    const side = submenu.dataset.preferredSide
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

    const cleanup = autoUpdate(trigger, submenu, update, {
      ancestorScroll: true,
      ancestorResize: true,
      elementResize: true,
      layoutShift: true,
      animationFrame: true
    })

    this.submenuCleanups.set(submenu, cleanup)
  }

  cleanupSubmenu(submenu) {
    if (this.submenuCleanups.has(submenu)) {
      this.submenuCleanups.get(submenu)()
      this.submenuCleanups.delete(submenu)
    }
  }

  // Close submenu (and its nested submenus) and cleanup autoUpdate
  closeSubmenuAndCleanup(submenu, trigger) {
    if (!submenu) return
    closeSubmenuUtil(submenu, trigger, this.boundCleanupSubmenu)
  }

  closeSubmenu(event) {
    const trigger = event.currentTarget
    const submenu = getSubmenu(trigger)
    const relatedTarget = event.relatedTarget

    if (!submenu) return
    if (relatedTarget && submenu.contains(relatedTarget)) return

    const timeoutId = setTimeout(() => {
      this.closeSubmenuAndCleanup(submenu, trigger)
      this.closeSubmenuTimeouts.delete(trigger)
    }, 300)

    this.closeSubmenuTimeouts.set(trigger, timeoutId)
  }

  cancelSubmenuClose(event) {
    const trigger = getSubmenuTrigger(event.currentTarget)

    if (trigger && this.closeSubmenuTimeouts.has(trigger)) {
      clearTimeout(this.closeSubmenuTimeouts.get(trigger))
      this.closeSubmenuTimeouts.delete(trigger)
    }
  }

  closeSiblingSubmenus(currentItem, parentMenu) {
    closeSiblingSubmenusUtil(currentItem, parentMenu, this.boundCleanupSubmenu)
  }

  // =========================================================================
  // CLICK OUTSIDE
  // =========================================================================

  handleClickOutside(event) {
    if (!this.openValue) return
    if (!this.element.contains(event.target)) {
      this.closeAll()
    }
  }

  // =========================================================================
  // KEYBOARD NAVIGATION
  // =========================================================================

  // Kept for backwards compatibility: keys are now always handled on the
  // menubar element (see connect).
  setupKeyboardNavigation() {}
  teardownKeyboardNavigation() {}

  handleKeydown(event) {
    if (!this.openValue || event.defaultPrevented) return
    if (this.triggerTargets.includes(event.target)) return // handleTriggerKeydown

    const activeContent = this.activeContent
    if (!activeContent || !activeContent.contains(event.target)) return

    if (event.key === 'Tab') {
      // Close and put focus on the trigger; the browser's Tab then leaves the
      // menubar from there (the other triggers have tabindex=-1).
      this.closeAll({ returnFocus: true })
      return
    }

    // Text fields own Space, Home/End, ←/→ and printable keys
    if (isEditableTarget(event.target)) return

    if (this.typeahead.isTypeaheadKey(event)) {
      const match = this.typeahead.handleKey(event, this.getCurrentMenuItems(), this.currentItem())
      if (match) this.focusMenuItem(match)
      return
    }

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

      case 'Enter':
      case ' ':
        event.preventDefault()
        this.activateCurrentItem()
        break
    }
  }

  handleTriggerKeydown(event) {
    const trigger = event.currentTarget
    const triggerIndex = this.triggerTargets.indexOf(trigger)

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
        this.suppressNativeClick()
        this.openMenu(triggerIndex, { focus: 'first' })
        break

      case 'ArrowUp':
        event.preventDefault()
        event.stopPropagation()
        this.openMenu(triggerIndex, { focus: 'last' })
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

  // preventDefault() on the keydown already stops the browser's synthetic
  // click on a <button>; this guards browsers that still send one.
  suppressNativeClick() {
    this.ignoreNextClick = true
    clearTimeout(this.ignoreClickTimer)
    this.ignoreClickTimer = setTimeout(() => { this.ignoreNextClick = false }, 0)
  }

  handleArrowRight() {
    const currentItem = this.currentItem()

    if (currentItem && hasSubmenu(currentItem) && !isItemDisabled(currentItem)) {
      this.openSubmenuWithKeyboard(currentItem)
    } else {
      this.navigateToNextMenu()
    }
  }

  handleArrowLeft() {
    if (!this.closeCurrentSubmenu()) {
      this.navigateToPreviousMenu()
    }
  }

  // =========================================================================
  // TRIGGER NAVIGATION
  // =========================================================================

  focusNextTrigger(currentIndex) {
    this.focusTrigger((currentIndex + 1) % this.triggerTargets.length)
  }

  focusPreviousTrigger(currentIndex) {
    this.focusTrigger(currentIndex === 0 ? this.triggerTargets.length - 1 : currentIndex - 1)
  }

  setTriggerTabindex(index) {
    this.triggerTargets.forEach((t, i) => {
      t.setAttribute('tabindex', i === index ? '0' : '-1')
    })
  }

  focusTrigger(index) {
    this.setTriggerTabindex(index)
    this.triggerTargets[index]?.focus()
  }

  navigateToNextMenu() {
    const nextIndex = (this.activeIndexValue + 1) % this.triggerTargets.length
    this.openMenu(nextIndex, { focus: 'first' })
  }

  navigateToPreviousMenu() {
    const prevIndex = this.activeIndexValue === 0 ?
      this.triggerTargets.length - 1 :
      this.activeIndexValue - 1
    this.openMenu(prevIndex, { focus: 'first' })
  }

  // =========================================================================
  // MENU ITEM NAVIGATION
  // =========================================================================

  getDirectMenuItems(menu) {
    return getMenuItems(menu)
  }

  currentItem() {
    const activeContent = this.activeContent
    if (!activeContent) return null
    const active = document.activeElement
    if (active && active.matches?.(MENU_ITEM_SELECTOR) && activeContent.contains(active)) return active
    return getKeyboardFocusedItem(activeContent) ||
      (this.lastHoveredItem && activeContent.contains(this.lastHoveredItem) ? this.lastHoveredItem : null)
  }

  getCurrentMenuItems() {
    const activeContent = this.activeContent
    if (!activeContent) return []

    const currentItem = this.currentItem()
    const currentMenu = currentItem ? currentItem.closest('[role="menu"]') : activeContent
    return getMenuItems(currentMenu)
  }

  focusMenuItem(item, content) {
    if (!item) return

    content = content || this.activeContent
    if (!content) return

    clearAllTabindexes(content)
    item.setAttribute('tabindex', '0')
    item.focus()
    this.lastHoveredItem = item

    const parentMenu = item.closest('[role="menu"]')
    if (parentMenu) this.closeSiblingSubmenus(item, parentMenu)
  }

  focusNextMenuItem() {
    const items = this.getCurrentMenuItems()
    if (items.length === 0) return

    const currentIndex = items.indexOf(this.currentItem())
    const nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1
    this.focusMenuItem(items[nextIndex])
  }

  focusPreviousMenuItem() {
    const items = this.getCurrentMenuItems()
    if (items.length === 0) return

    const currentIndex = items.indexOf(this.currentItem())
    const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1
    this.focusMenuItem(items[prevIndex])
  }

  focusFirstMenuItem() {
    const items = this.getCurrentMenuItems()
    if (items.length > 0) this.focusMenuItem(items[0])
  }

  focusLastMenuItem() {
    const items = this.getCurrentMenuItems()
    if (items.length > 0) this.focusMenuItem(items[items.length - 1])
  }

  // =========================================================================
  // SUBMENU KEYBOARD
  // =========================================================================

  openSubmenuWithKeyboard(trigger) {
    const submenu = getSubmenu(trigger)
    if (!submenu || isItemDisabled(trigger)) return

    const activeContent = this.activeContent

    const parentMenu = trigger.closest('[role="menu"]')
    if (parentMenu) this.closeSiblingSubmenus(trigger, parentMenu)

    this.openSubmenuWithAutoUpdate(trigger, submenu)

    const submenuItems = getMenuItems(submenu)
    if (submenuItems.length > 0 && activeContent) {
      clearAllTabindexes(activeContent)
      submenuItems[0].setAttribute('tabindex', '0')
      submenuItems[0].focus()
      this.lastHoveredItem = submenuItems[0]
    }
  }

  // Close the submenu holding the current item and focus its trigger.
  // Submenus are found structurally (a menu inside a menu), never by data-side.
  closeCurrentSubmenu() {
    const activeContent = this.activeContent
    const currentItem = this.currentItem()
    if (!activeContent || !currentItem) return false

    const parentMenu = currentItem.closest('[role="menu"]')
    const trigger = getSubmenuTrigger(parentMenu)
    if (!trigger) return false

    this.closeSubmenuAndCleanup(parentMenu, trigger)
    clearAllTabindexes(activeContent)
    trigger.setAttribute('tabindex', '0')
    trigger.focus()
    this.lastHoveredItem = trigger
    return true
  }

  // =========================================================================
  // ITEM ACTIVATION
  // =========================================================================

  activateCurrentItem() {
    const currentItem = this.currentItem()
    if (!currentItem || isItemDisabled(currentItem)) return

    const role = currentItem.getAttribute('role')

    if (role === 'menuitem' && hasSubmenu(currentItem)) {
      this.openSubmenuWithKeyboard(currentItem)
      return
    }

    // A real click: the item's own click handlers (and selectItem, which
    // toggles checkbox/radio items or closes the menu) run as for a pointer.
    currentItem.click()

    if (role === 'menuitem' && this.openValue) {
      this.closeAll({ returnFocus: true })
    }
  }

  // =========================================================================
  // CHECKBOX / RADIO
  // =========================================================================

  toggleCheckbox(item) {
    toggleCheckboxUtil(item)
  }

  selectRadio(item) {
    selectRadioUtil(item)
  }
}
