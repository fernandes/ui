import { Controller } from "@hotwired/stimulus"
import { computePosition, flip, offset, shift, autoUpdate } from "@floating-ui/dom"
import {
  MENU_ITEM_SELECTOR,
  getMenuItems,
  focusItem as focusItemUtil,
  focusNextItem as focusNextItemUtil,
  focusPreviousItem as focusPreviousItemUtil,
  hasSubmenu,
  getSubmenu,
  getSubmenuTrigger,
  isSubmenu,
  initSubmenuTriggers,
  openSubmenu,
  closeSubmenu,
  closeAllSubmenus,
  closeSiblingSubmenus,
  clearAllTabindexes,
  updateRovingTabindex,
  getKeyboardFocusedItem,
  isItemDisabled,
  isEditableTarget,
  createTypeahead,
  toggleCheckbox as toggleCheckboxUtil,
  selectRadio as selectRadioUtil
} from "../utils/menu_utils.js"
import { ensureId, setIdRefs } from "../utils/id-manager.js"
import { createEscapeLayer } from "../utils/escape-key-manager.js"

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
const NATIVE_ACTIVATOR = 'button, a[href], input[type="button"], input[type="submit"], input[type="reset"], summary'

// Dropdown Menu controller (WAI-ARIA menu button + menu).
//
// - Trigger: aria-haspopup="menu", aria-expanded, aria-controls → menu; the
//   menu is labelled by the trigger. Enter/Space/ArrowDown open on the first
//   item, ArrowUp on the last.
// - Menu: roving focus, Home/End, typeahead, disabled items skipped,
//   submenus with ArrowRight/ArrowLeft (Enter/Space also open them).
// - Escape goes through the shared layer stack: it closes the innermost open
//   submenu, then the menu, and focus returns to the trigger. Selecting an
//   item (keyboard or pointer) and Tab also return focus to the trigger.
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
  }

  connect() {
    this.typeahead = createTypeahead()
    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    this.boundHandleFocusOut = this.handleFocusOut.bind(this)

    document.addEventListener('click', this.boundHandleClickOutside)
    this.element.addEventListener('focusout', this.boundHandleFocusOut)
    // Menu keys are handled on the component, never page-wide: keys typed
    // outside the menu (or in a text field inside it) are left alone.
    this.element.addEventListener('keydown', this.boundHandleKeydown)

    this.escapeLayer = createEscapeLayer(() => this.handleEscape(), { element: this.element })

    this.setupAria()
    this.resetToClosed()
  }

  disconnect() {
    if (this.cleanup) {
      this.cleanup()
      this.cleanup = null
    }

    this.clearSubmenuTimeouts()
    this.escapeLayer?.deactivate()
    this.typeahead?.reset()

    document.removeEventListener('click', this.boundHandleClickOutside)
    this.element.removeEventListener('keydown', this.boundHandleKeydown)
    this.element.removeEventListener('focusout', this.boundHandleFocusOut)
  }

  // ===========================================================================
  // ARIA / STATE
  // ===========================================================================

  get menuElement() {
    return this.hasMenuTarget ? this.menuTarget : (this.hasContentTarget ? this.contentTarget : null)
  }

  // The element that carries the menu-button semantics: the trigger target
  // itself, or the button/link it wraps.
  get triggerElement() {
    if (!this.hasTriggerTarget) return null
    const trigger = this.triggerTarget
    if (trigger.matches(`${NATIVE_ACTIVATOR}, [role="button"]`)) return trigger
    return trigger.querySelector(FOCUSABLE) || trigger
  }

  setupAria() {
    const menu = this.menuElement
    const trigger = this.triggerElement
    if (!menu) return

    ensureId(menu, 'dropdown-menu-content')
    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'menu')
      trigger.setAttribute('aria-expanded', String(this.openValue))
      setIdRefs(trigger, 'aria-controls', menu, { prefix: 'dropdown-menu-trigger' })
      setIdRefs(menu, 'aria-labelledby', trigger, { prefix: 'dropdown-menu-trigger' })
    }
    initSubmenuTriggers(this.element, 'dropdown-menu')
  }

  // A Turbo snapshot taken while the menu was open restores it with
  // data-state="open" (and open-value="true") but no live state behind it.
  // Start every connect closed.
  resetToClosed() {
    const menu = this.menuElement
    if (!menu) return
    if (this.openValue || menu.getAttribute('data-state') === 'open') {
      this.openValue = false
      closeAllSubmenus(this.element)
      clearAllTabindexes(this.element)
      menu.classList.add('hidden')
      menu.setAttribute('data-state', 'closed')
      this.triggerElement?.setAttribute('aria-expanded', 'false')
    }
  }

  // ===========================================================================
  // OPEN / CLOSE
  // ===========================================================================

  toggle(event) {
    // Legacy markup bound `keydown.enter/space->toggle` on the trigger. On a
    // native button or link the browser fires a click as well: let the click
    // do it, or the menu opens and closes again.
    if (event && event.type === 'keydown') {
      if (this.isNativeActivation(event)) return
      event.preventDefault()
    }

    if (this.openValue) {
      this.close()
    } else {
      this.open()
    }
  }

  handleTriggerKeydown(event) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        if (this.isNativeActivation(event)) return // the native click toggles
        event.preventDefault()
        this.toggle()
        break
      case 'ArrowDown':
        event.preventDefault()
        if (this.openValue) this.focusItem(0)
        else this.open({ focus: 'first' })
        break
      case 'ArrowUp':
        event.preventDefault()
        if (this.openValue) this.focusItem(this.getFocusableItems().length - 1)
        else this.open({ focus: 'last' })
        break
    }
  }

  isNativeActivation(event) {
    const activator = event.target.closest?.(NATIVE_ACTIVATOR)
    return !!(activator && this.hasTriggerTarget && this.triggerTarget.contains(activator))
  }

  open({ focus = 'first' } = {}) {
    const menu = this.menuElement
    if (!menu) return

    this.openValue = true
    this.typeahead.reset()
    menu.classList.remove('hidden')
    menu.setAttribute('data-state', 'open')
    this.triggerElement?.setAttribute('aria-expanded', 'true')
    this.positionDropdown()
    this.escapeLayer.activate()

    const items = this.getMenuItems(menu)
    if (focus === 'last') this.focusItem(items.length - 1)
    else if (focus) this.focusItem(0)
  }

  close(options = {}) {
    const { returnFocus = false } = options
    const wasOpen = this.openValue
    const menu = this.menuElement

    this.openValue = false
    this.escapeLayer?.deactivate()
    this.typeahead?.reset()

    // Move focus back before hiding the menu, so it never drops to <body>.
    if (returnFocus && wasOpen) this.focusTrigger()

    this.clearSubmenuTimeouts()
    closeAllSubmenus(this.element)
    clearAllTabindexes(this.element)
    this.lastHoveredItem = null

    if (menu) {
      menu.classList.add('hidden')
      menu.setAttribute('data-state', 'closed')
    }
    this.triggerElement?.setAttribute('aria-expanded', 'false')

    if (this.cleanup) {
      this.cleanup()
      this.cleanup = null
    }
  }

  focusTrigger() {
    this.triggerElement?.focus()
  }

  handleEscape() {
    const focusedCommandOption = this.focusedCommandOption()
    if (focusedCommandOption) {
      this.closeCommandSubmenu(focusedCommandOption.closest('[data-controller~="command"]'))
    } else if (!this.closeCurrentSubmenuWithKeyboard()) {
      this.close({ returnFocus: true })
    }
  }

  handleFocusOut() {
    if (!this.openValue) return

    // Let the new focus target settle, then close if focus left the component
    setTimeout(() => {
      if (this.openValue && !this.element.contains(document.activeElement)) {
        this.close({ returnFocus: false })
      }
    }, 0)
  }

  handleClickOutside(event) {
    if (!this.openValue) return
    if (!this.element.contains(event.target)) {
      this.close({ returnFocus: false })
    }
  }

  // ===========================================================================
  // ITEM ACTIONS
  // ===========================================================================

  // click on a menuitem: activate and close, focus back to the trigger
  select(event) {
    const item = event.currentTarget
    if (isItemDisabled(item)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    if (hasSubmenu(item)) return
    this.close({ returnFocus: true })
  }

  toggleCheckbox(event) {
    const item = event.currentTarget
    if (item.getAttribute('role') !== 'menuitemcheckbox') return
    event.stopPropagation()
    toggleCheckboxUtil(item)
  }

  selectRadio(event) {
    const item = event.currentTarget
    if (item.getAttribute('role') !== 'menuitemradio') return
    event.stopPropagation()
    selectRadioUtil(item)
  }

  // ===========================================================================
  // POINTER
  // ===========================================================================

  trackHoveredItem(event) {
    const item = event.currentTarget
    if (isItemDisabled(item)) return

    // Focusing the hovered item (instead of blurring the old one) keeps focus
    // inside the dropdown, so handleFocusOut doesn't close the menu.
    updateRovingTabindex(this.element, item)
    item.focus()
    this.lastHoveredItem = item
  }

  openSubmenuHandler(event) {
    const trigger = event.currentTarget
    const submenu = getSubmenu(trigger)
    if (isItemDisabled(trigger)) return

    updateRovingTabindex(this.element, trigger)
    trigger.focus()
    this.lastHoveredItem = trigger

    if (this.closeSubmenuTimeouts.has(trigger)) {
      clearTimeout(this.closeSubmenuTimeouts.get(trigger))
      this.closeSubmenuTimeouts.delete(trigger)
    }

    if (submenu) {
      this.closeSiblingSubmenus(trigger)
      openSubmenu(trigger, submenu)
      this.focusFirstCommandItem(submenu)
    }
  }

  // Backwards compatibility alias (used in markup: mouseenter->ui--dropdown#openSubmenu)
  openSubmenu(event) {
    return this.openSubmenuHandler(event)
  }

  closeSubmenuHandler(event) {
    const trigger = event.currentTarget
    const submenu = getSubmenu(trigger)
    const relatedTarget = event.relatedTarget

    if (relatedTarget && submenu && submenu.contains(relatedTarget)) return

    // Delay so the pointer can travel into the submenu
    const timeoutId = setTimeout(() => {
      if (submenu) closeSubmenu(submenu, trigger)
      this.closeSubmenuTimeouts.delete(trigger)
    }, 300)

    this.closeSubmenuTimeouts.set(trigger, timeoutId)
  }

  // Backwards compatibility alias (used in markup: mouseleave->ui--dropdown#closeSubmenu)
  closeSubmenu(event) {
    return this.closeSubmenuHandler(event)
  }

  closeSiblingSubmenus(currentTrigger) {
    closeSiblingSubmenus(currentTrigger)
  }

  closeAllSubmenusHandler() {
    closeAllSubmenus(this.element)
  }

  // Backwards compatibility alias
  closeAllSubmenus() {
    return this.closeAllSubmenusHandler()
  }

  clearSubmenuTimeouts() {
    this.closeSubmenuTimeouts.forEach((timeoutId) => clearTimeout(timeoutId))
    this.closeSubmenuTimeouts.clear()
  }

  // ===========================================================================
  // KEYBOARD
  // ===========================================================================

  handleKeydown(event) {
    if (!this.openValue || event.defaultPrevented) return

    const menu = this.menuElement
    const target = event.target
    if (!menu || !menu.contains(target)) return // trigger keys: handleTriggerKeydown

    // A Command inside a submenu: its options are navigated with the arrows
    const focusedCommandOption = this.focusedCommandOption()
    if (focusedCommandOption && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      this.handleCommandNavigation(event, focusedCommandOption.closest('[data-controller~="command"]'))
      return
    }

    if (event.key === 'Tab') {
      // Close and put focus on the trigger; the browser's Tab then moves on
      // from there, to the element after (or before) the menu button.
      this.close({ returnFocus: true })
      return
    }

    // Text fields own Space, Home/End, ←/→ and printable keys
    if (isEditableTarget(target)) return

    const current = this.currentItem()

    if (this.typeahead.isTypeaheadKey(event)) {
      const match = this.typeahead.handleKey(event, this.getFocusableItems(), current)
      if (match) this.focusItemElement(match)
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.focusNextItem()
        break

      case 'ArrowUp':
        event.preventDefault()
        this.focusPreviousItem()
        break

      case 'ArrowRight':
        event.preventDefault()
        if (current && hasSubmenu(current)) this.openSubmenuWithKeyboard(current)
        break

      case 'ArrowLeft':
        event.preventDefault()
        if (focusedCommandOption) {
          this.closeCommandSubmenu(focusedCommandOption.closest('[data-controller~="command"]'))
        } else {
          this.closeCurrentSubmenuWithKeyboard()
        }
        break

      case 'Home':
        event.preventDefault()
        this.focusItem(0)
        break

      case 'End':
        event.preventDefault()
        this.focusItem(this.getFocusableItems().length - 1)
        break

      case 'Enter':
      case ' ':
        event.preventDefault()
        this.activateItem(current, { closeOnCheck: event.key === 'Enter' })
        break
    }
  }

  // Enter/Space on an item. Checkbox/radio: Enter toggles and closes, Space
  // toggles and keeps the menu open (React Aria).
  activateItem(item, { closeOnCheck }) {
    if (!item || isItemDisabled(item)) return
    const role = item.getAttribute('role')

    if (role === 'menuitem') {
      if (hasSubmenu(item)) {
        this.openSubmenuWithKeyboard(item)
      } else {
        item.click()
        this.close({ returnFocus: true })
      }
    } else if (role === 'menuitemcheckbox' || role === 'menuitemradio') {
      item.click()
      if (closeOnCheck) this.close({ returnFocus: true })
    }
  }

  currentItem() {
    const active = document.activeElement
    if (active && active.matches?.(MENU_ITEM_SELECTOR) && this.element.contains(active)) return active
    return getKeyboardFocusedItem(this.element)
  }

  focusedCommandOption() {
    return this.element.querySelector('[data-controller~="command"] [role="option"][data-focused="true"]')
  }

  getMenuItems(menu) {
    return getMenuItems(menu)
  }

  getFocusableItems() {
    return getMenuItems(this.getCurrentMenu())
  }

  getCurrentMenu() {
    const current = this.currentItem()
    if (current) return current.closest('[role="menu"]')
    return this.menuElement
  }

  focusNextItem() {
    const result = focusNextItemUtil(this.getFocusableItems(), this.element, true)
    if (result) this.afterKeyboardFocus(result)
  }

  focusPreviousItem() {
    const result = focusPreviousItemUtil(this.getFocusableItems(), this.element, true)
    if (result) this.afterKeyboardFocus(result)
  }

  focusItem(index) {
    const items = this.getFocusableItems()
    if (items.length === 0 || index < 0 || index >= items.length) return

    const targetItem = focusItemUtil(items, index, this.element)
    if (targetItem) this.afterKeyboardFocus(targetItem)
  }

  focusItemElement(item) {
    updateRovingTabindex(this.element, item)
    item.focus()
    this.afterKeyboardFocus(item)
  }

  // Moving through a menu with the keyboard closes the submenus of the other
  // items at that level.
  afterKeyboardFocus(item) {
    this.lastHoveredItem = item
    closeSiblingSubmenus(item)
  }

  openSubmenuWithKeyboard(trigger) {
    const submenu = getSubmenu(trigger)
    if (!submenu || isItemDisabled(trigger)) return

    this.closeSiblingSubmenus(trigger)
    openSubmenu(trigger, submenu)

    if (submenu.querySelector('[data-controller~="command"]')) {
      this.focusFirstCommandItem(submenu)
      return
    }

    const first = getMenuItems(submenu)[0]
    if (first) {
      updateRovingTabindex(this.element, first)
      first.focus()
      this.lastHoveredItem = first
    }
  }

  // Close the submenu holding the current item and focus its trigger.
  // Returns false at the top level.
  closeCurrentSubmenuWithKeyboard() {
    const current = this.currentItem()
    if (!current) return false

    const menu = current.closest('[role="menu"]')
    const trigger = getSubmenuTrigger(menu)
    if (!trigger) return false

    closeSubmenu(menu, trigger)
    updateRovingTabindex(this.element, trigger)
    trigger.focus()
    this.lastHoveredItem = trigger
    return true
  }

  // ===========================================================================
  // COMMAND INSIDE A SUBMENU
  // ===========================================================================

  focusFirstCommandItem(submenu) {
    const commandElement = submenu.querySelector('[data-controller~="command"]')
    if (!commandElement) return

    // Wait a tick for the command controller to initialize
    setTimeout(() => {
      const firstOption = commandElement.querySelector('[role="option"]:not([data-hidden])')
      if (!firstOption) return

      commandElement.querySelectorAll('[role="option"]').forEach(option => {
        option.removeAttribute('data-focused')
        option.classList.remove('bg-accent', 'text-accent-foreground')
      })

      firstOption.setAttribute('data-focused', 'true')
      firstOption.classList.add('bg-accent', 'text-accent-foreground')
    }, 50)
  }

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

    allOptions.forEach(opt => {
      opt.removeAttribute('data-focused')
      opt.classList.remove('bg-accent', 'text-accent-foreground')
    })

    if (allOptions[currentIndex]) {
      allOptions[currentIndex].setAttribute('data-focused', 'true')
      allOptions[currentIndex].classList.add('bg-accent', 'text-accent-foreground')
      allOptions[currentIndex].scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
    }
  }

  closeCommandSubmenu(commandElement) {
    const submenu = commandElement.closest('[role="menu"]')
    if (!isSubmenu(submenu)) return false

    const trigger = getSubmenuTrigger(submenu)
    if (!trigger) return false

    commandElement.querySelectorAll('[role="option"]').forEach(option => {
      option.removeAttribute('data-focused')
      option.classList.remove('bg-accent', 'text-accent-foreground')
    })

    closeSubmenu(submenu, trigger)
    updateRovingTabindex(this.element, trigger)
    trigger.focus()
    this.lastHoveredItem = trigger
    return true
  }

  // ===========================================================================
  // POSITIONING
  // ===========================================================================

  positionDropdown() {
    const trigger = this.hasTriggerTarget ? this.triggerTarget : this.element
    const content = this.menuElement

    if (!trigger || !content) return

    if (this.cleanup) this.cleanup()

    const middleware = []
    if (this.offsetValue > 0) middleware.push(offset(this.offsetValue))
    if (this.flipValue) middleware.push(flip())
    middleware.push(shift({ padding: 8 }))

    content.style.setProperty('--ui-dropdown-menu-trigger-width', `${trigger.offsetWidth}px`)

    const update = () => {
      computePosition(trigger, content, {
        placement: this.placementValue,
        middleware: middleware,
        strategy: this.strategyValue
      }).then(({ x, y, placement }) => {
        content.style.setProperty('--ui-dropdown-menu-trigger-width', `${trigger.offsetWidth}px`)

        Object.assign(content.style, {
          position: this.strategyValue,
          left: `${x}px`,
          top: `${y}px`,
        })

        const [side, align] = placement.split('-')
        content.setAttribute('data-side', side)
        content.setAttribute('data-align', align || 'center')
      })
    }

    this.cleanup = autoUpdate(trigger, content, update, {
      ancestorScroll: true,
      ancestorResize: true,
      elementResize: true,
      layoutShift: true,
      animationFrame: true
    })
  }
}
