import { Controller } from "@hotwired/stimulus"
import {
  MENU_ITEM_SELECTOR,
  getMenuItems,
  focusItem as focusItemUtil,
  focusNextItem as focusNextItemUtil,
  focusPreviousItem as focusPreviousItemUtil,
  clearAllTabindexes,
  updateRovingTabindex,
  getKeyboardFocusedItem,
  isItemDisabled,
  isEditableTarget,
  createTypeahead,
  toggleCheckbox,
  selectRadio
} from "../utils/menu_utils.js"
import { ensureId } from "../utils/id-manager.js"
import { createEscapeLayer } from "../utils/escape-key-manager.js"

// Only one context menu is open at a time; opening another closes this one.
let activeMenu = null

// Context Menu controller - opened by right-click (or the keyboard's context
// menu key / Shift+F10), with menu keyboard support.
//
// - Keys are handled on the menu itself, never page-wide.
// - Closes on Escape (shared layer stack), on selecting an item, on Tab, when
//   focus leaves the menu, and on a click or right-click outside it.
// - Escape, selection and Tab return focus to the element that had it when
//   the menu opened.
export default class extends Controller {
  static targets = ["trigger", "content", "item"]
  static values = {
    open: { type: Boolean, default: false }
  }

  constructor() {
    super(...arguments)
    this.lastHoveredItem = null
    this.returnFocusTo = null
  }

  connect() {
    this.typeahead = createTypeahead()
    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    this.boundHandleFocusOut = this.handleFocusOut.bind(this)

    this.escapeLayer = createEscapeLayer(() => this.close({ returnFocus: true }), { element: this.element })

    if (this.hasContentTarget) {
      ensureId(this.contentTarget, 'context-menu-content')
      this.contentTarget.addEventListener('keydown', this.boundHandleKeydown)
      this.contentTarget.addEventListener('focusout', this.boundHandleFocusOut)
    }

    this.resetToClosed()
  }

  disconnect() {
    this.escapeLayer?.deactivate()
    this.typeahead?.reset()
    this.removeDocumentListeners()
    if (activeMenu === this) activeMenu = null

    if (this.hasContentTarget) {
      this.contentTarget.removeEventListener('keydown', this.boundHandleKeydown)
      this.contentTarget.removeEventListener('focusout', this.boundHandleFocusOut)
    }
  }

  // A Turbo snapshot taken while open restores data-state="open" with no live
  // state behind it: start every connect closed.
  resetToClosed() {
    if (!this.hasContentTarget) return
    if (this.openValue || this.contentTarget.getAttribute('data-state') === 'open') {
      this.openValue = false
      this.contentTarget.classList.add('hidden')
      this.contentTarget.setAttribute('data-state', 'closed')
      clearAllTabindexes(this.element)
    }
  }

  // ===========================================================================
  // OPEN / CLOSE
  // ===========================================================================

  // contextmenu on the trigger
  open(event) {
    event.preventDefault() // no browser context menu
    event.stopPropagation() // an outer context menu (or our document listener) must not react

    if (activeMenu && activeMenu !== this) activeMenu.close({ returnFocus: false })
    activeMenu = this

    const content = this.contentTarget
    if (!this.openValue) {
      const active = document.activeElement
      this.returnFocusTo = active && !content.contains(active) ? active : null
    }

    this.openValue = true
    this.typeahead.reset()
    content.classList.remove('hidden')
    content.setAttribute('data-state', 'open')

    const { x, y } = this.pointFor(event)
    this.positionContextMenu(x, y)

    this.escapeLayer.activate()
    this.addDocumentListeners()
    this.focusItem(0)
  }

  close(options = {}) {
    const { returnFocus = false } = options
    const wasOpen = this.openValue

    this.openValue = false
    this.escapeLayer?.deactivate()
    this.typeahead?.reset()
    this.removeDocumentListeners()
    if (activeMenu === this) activeMenu = null

    if (returnFocus && wasOpen) this.restoreFocus()

    if (this.hasContentTarget) {
      this.contentTarget.classList.add('hidden')
      this.contentTarget.setAttribute('data-state', 'closed')
    }

    clearAllTabindexes(this.element)
    this.lastHoveredItem = null
  }

  restoreFocus() {
    const target = this.returnFocusTo
    this.returnFocusTo = null
    if (target && target.isConnected && target !== document.body && typeof target.focus === 'function') {
      target.focus()
    } else if (this.hasContentTarget && this.contentTarget.contains(document.activeElement)) {
      document.activeElement.blur()
    }
  }

  // Backwards compatible: close whichever context menu is open
  closeAllContextMenus() {
    if (activeMenu && activeMenu !== this) activeMenu.close({ returnFocus: false })
  }

  addDocumentListeners() {
    if (this.listening) return
    document.addEventListener('click', this.boundHandleClickOutside)
    document.addEventListener('contextmenu', this.boundHandleClickOutside)
    this.listening = true
  }

  removeDocumentListeners() {
    if (!this.listening) return
    document.removeEventListener('click', this.boundHandleClickOutside)
    document.removeEventListener('contextmenu', this.boundHandleClickOutside)
    this.listening = false
  }

  // A click or right-click anywhere outside the menu closes it
  handleClickOutside(event) {
    if (!this.openValue) return
    if (!this.contentTarget.contains(event.target)) this.close({ returnFocus: false })
  }

  handleFocusOut() {
    if (!this.openValue) return
    setTimeout(() => {
      if (this.openValue && !this.contentTarget.contains(document.activeElement)) {
        this.close({ returnFocus: false })
      }
    }, 0)
  }

  // ===========================================================================
  // ITEMS
  // ===========================================================================

  // click on any item: checkbox/radio toggle and stay open, plain items close
  select(event) {
    const item = event.currentTarget
    if (isItemDisabled(item)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }

    const role = item.getAttribute('role')
    if (role === 'menuitemcheckbox') {
      toggleCheckbox(item)
    } else if (role === 'menuitemradio') {
      selectRadio(item)
    } else {
      this.close({ returnFocus: true })
    }
  }

  trackHoveredItem(event) {
    const item = event.currentTarget
    if (isItemDisabled(item)) return

    // Focus the hovered item: focus stays in the menu and keyboard navigation
    // continues from here.
    updateRovingTabindex(this.element, item)
    item.focus()
    this.lastHoveredItem = item
  }

  // ===========================================================================
  // KEYBOARD
  // ===========================================================================

  handleKeydown(event) {
    if (!this.openValue || event.defaultPrevented) return

    if (event.key === 'Tab') {
      this.close({ returnFocus: true })
      return
    }

    if (isEditableTarget(event.target)) return

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

      case 'Home':
        event.preventDefault()
        this.focusItem(0)
        break

      case 'End':
        event.preventDefault()
        this.focusItem(this.getFocusableItems().length - 1)
        break

      case 'Enter':
      case ' ': {
        event.preventDefault()
        if (!current || isItemDisabled(current)) break
        const isCheckable = current.getAttribute('role') !== 'menuitem'
        current.click()
        // Enter closes after toggling a checkbox/radio, Space keeps the menu open
        if (this.openValue && (!isCheckable || event.key === 'Enter')) this.close({ returnFocus: true })
        break
      }
    }
  }

  currentItem() {
    const active = document.activeElement
    if (active && active.matches?.(MENU_ITEM_SELECTOR) && this.contentTarget.contains(active)) return active
    return getKeyboardFocusedItem(this.element)
  }

  getFocusableItems() {
    if (!this.hasContentTarget) return []
    return getMenuItems(this.contentTarget)
  }

  getKeyboardFocusedItem() {
    return getKeyboardFocusedItem(this.element)
  }

  focusNextItem() {
    const item = focusNextItemUtil(this.getFocusableItems(), this.element, true)
    if (item) this.lastHoveredItem = item
  }

  focusPreviousItem() {
    const item = focusPreviousItemUtil(this.getFocusableItems(), this.element, true)
    if (item) this.lastHoveredItem = item
  }

  focusItem(index) {
    const item = focusItemUtil(this.getFocusableItems(), index, this.element)
    if (item) this.lastHoveredItem = item
  }

  focusItemElement(item) {
    updateRovingTabindex(this.element, item)
    item.focus()
    this.lastHoveredItem = item
  }

  // ===========================================================================
  // POSITIONING
  // ===========================================================================

  // Pointer: the cursor. Keyboard (context menu key / Shift+F10 report 0,0):
  // the bottom-left corner of the focused element.
  pointFor(event) {
    if (event.clientX || event.clientY) return { x: event.clientX, y: event.clientY }
    const rect = event.target?.getBoundingClientRect?.()
    return rect ? { x: rect.left, y: rect.bottom } : { x: 0, y: 0 }
  }

  positionContextMenu(x, y) {
    const content = this.contentTarget
    if (!content) return

    Object.assign(content.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
    })

    requestAnimationFrame(() => {
      const rect = content.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      if (rect.right > viewportWidth) adjustedX = viewportWidth - rect.width - 8
      if (rect.bottom > viewportHeight) adjustedY = viewportHeight - rect.height - 8

      adjustedX = Math.max(8, adjustedX)
      adjustedY = Math.max(8, adjustedY)

      content.style.left = `${adjustedX}px`
      content.style.top = `${adjustedY}px`

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
