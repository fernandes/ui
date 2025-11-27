/**
 * UI Utilities Index
 *
 * Export all shared utilities for controllers
 */

// State Management
export {
  setState,
  getState,
  isOpen,
  toggleState,
  setStateOnMultiple,
  syncCheckedState,
  syncPressedState,
  syncExpandedState,
  syncModalState,
  createStateSynchronizer
} from './state-manager.js'

// Floating UI Positioning
export {
  createPositioner,
  position,
  positionOnce,
  getPlacementFromAttributes,
  parsePlacement
} from './floating-ui-positioner.js'

// Escape Key Handling
export {
  createEscapeKeyHandler,
  onEscapeKey,
  onEscapeKeyWhen
} from './escape-key-manager.js'

// Focus Trap
export {
  getFocusableElements,
  getFirstFocusable,
  getLastFocusable,
  isMobileDevice,
  focusFirstElement,
  createFocusTrap,
  trapFocus
} from './focus-trap-manager.js'

// Click Outside Detection
export {
  createClickOutsideHandler,
  onClickOutside,
  onClickOutsideWhen
} from './click-outside-manager.js'

// Scroll Lock
export {
  lockScroll,
  unlockScroll,
  forceUnlockScroll,
  isScrollLocked,
  getScrollLockCount,
  resetScrollLockState,
  createScrollLock,
  preventTouchScroll
} from './scroll-lock-manager.js'

// Menu Utilities (existing)
export {
  toggleCheckbox,
  selectRadio,
  getFocusableItems,
  findCurrentItemIndex,
  focusItem,
  focusNextItem,
  focusPreviousItem,
  hasSubmenu,
  openSubmenu,
  closeSubmenu,
  closeAllSubmenus,
  closeSiblingSubmenus,
  positionDropdown,
  positionSubmenu,
  updateRovingTabindex,
  clearAllTabindexes,
  getKeyboardFocusedItem
} from './menu_utils.js'
