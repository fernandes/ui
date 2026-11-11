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
  createEscapeLayer,
  getEscapeLayerCount,
  resetEscapeLayers,
  createEscapeKeyHandler,
  onEscapeKey,
  onEscapeKeyWhen
} from './escape-key-manager.js'

// Per-instance ids and aria id references
export {
  ensureId,
  setIdRefs,
  addIdRef,
  removeIdRef
} from './id-manager.js'

// Inert background
export {
  inertOthers,
  getInertLayerCount,
  resetInert
} from './inert-manager.js'

// Modal session (trap + restore + inert + scroll lock + Escape)
export { createModalSession } from './modal-session.js'

// Focus Trap
export {
  isTabbable,
  isFocusable,
  getTabbableElements,
  focusInitial,
  getFocusableElements,
  getFirstFocusable,
  getLastFocusable,
  isMobileDevice,
  focusFirstElement,
  createFocusTrap,
  resetFocusTraps,
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
  getKeyboardFocusedItem,
  MENU_ITEM_SELECTOR,
  isItemDisabled,
  isEditableTarget,
  getMenuItems,
  getItemTextValue,
  createTypeahead,
  findTypeaheadMatch,
  getSubmenu,
  isSubmenu,
  getSubmenuTrigger,
  initSubmenuTriggers
} from './menu_utils.js'
