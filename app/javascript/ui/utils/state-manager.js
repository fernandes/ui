/**
 * State Manager Utility
 *
 * Manages data-state and aria-* attributes synchronization across elements.
 * Used by dialog, alert_dialog, drawer, accordion, tabs, toggle, checkbox, switch, popover, etc.
 */

/**
 * Set state on a single element
 * @param {HTMLElement} element - Target element
 * @param {string} state - State value (e.g., 'open', 'closed', 'checked', 'unchecked')
 * @param {Object} options - Additional options
 * @param {string} options.ariaAttribute - ARIA attribute to sync (e.g., 'aria-expanded', 'aria-checked')
 * @param {boolean} options.ariaValue - Value for ARIA attribute (defaults to state === 'open' or state === 'checked')
 */
export function setState(element, state, options = {}) {
  if (!element) return

  element.setAttribute('data-state', state)

  if (options.ariaAttribute) {
    const ariaValue = options.ariaValue !== undefined
      ? options.ariaValue
      : (state === 'open' || state === 'checked' || state === 'on')
    element.setAttribute(options.ariaAttribute, ariaValue.toString())
  }
}

/**
 * Get state from an element
 * @param {HTMLElement} element - Target element
 * @returns {string|null} Current state value
 */
export function getState(element) {
  if (!element) return null
  return element.getAttribute('data-state')
}

/**
 * Check if element is in open/active state
 * @param {HTMLElement} element - Target element
 * @returns {boolean}
 */
export function isOpen(element) {
  const state = getState(element)
  return state === 'open' || state === 'checked' || state === 'on' || state === 'active'
}

/**
 * Toggle state between two values
 * @param {HTMLElement} element - Target element
 * @param {string} stateA - First state (e.g., 'open')
 * @param {string} stateB - Second state (e.g., 'closed')
 * @param {Object} options - Additional options for setState
 * @returns {string} The new state
 */
export function toggleState(element, stateA = 'open', stateB = 'closed', options = {}) {
  const currentState = getState(element)
  const newState = currentState === stateA ? stateB : stateA
  setState(element, newState, options)
  return newState
}

/**
 * Set state on multiple elements at once
 * @param {HTMLElement[]} elements - Array of target elements
 * @param {string} state - State value
 * @param {Object} options - Additional options for setState
 */
export function setStateOnMultiple(elements, state, options = {}) {
  elements.forEach(element => {
    if (element) {
      setState(element, state, options)
    }
  })
}

/**
 * Sync checkbox-like state (checked/unchecked)
 * @param {HTMLElement} element - Target element
 * @param {boolean} checked - Whether checked
 * @param {Object} options - Additional options
 * @param {HTMLElement[]} options.additionalTargets - Additional elements to sync
 */
export function syncCheckedState(element, checked, options = {}) {
  const state = checked ? 'checked' : 'unchecked'

  setState(element, state, { ariaAttribute: 'aria-checked', ariaValue: checked })

  if (options.additionalTargets) {
    options.additionalTargets.forEach(target => {
      if (target) {
        setState(target, state)
      }
    })
  }
}

/**
 * Sync toggle/pressed state (on/off or pressed/not pressed)
 * @param {HTMLElement} element - Target element
 * @param {boolean} pressed - Whether pressed/on
 * @param {Object} options - Additional options
 * @param {boolean} options.useOnOff - Use 'on'/'off' instead of default states
 */
export function syncPressedState(element, pressed, options = {}) {
  const state = options.useOnOff
    ? (pressed ? 'on' : 'off')
    : (pressed ? 'pressed' : 'unpressed')

  setState(element, state, { ariaAttribute: 'aria-pressed', ariaValue: pressed })
}

/**
 * Sync expanded state (for accordions, collapsibles, etc.)
 * @param {HTMLElement} trigger - Trigger element
 * @param {HTMLElement} content - Content element
 * @param {boolean} expanded - Whether expanded
 */
export function syncExpandedState(trigger, content, expanded) {
  const state = expanded ? 'open' : 'closed'

  if (trigger) {
    setState(trigger, state, { ariaAttribute: 'aria-expanded', ariaValue: expanded })
  }

  if (content) {
    setState(content, state)
  }
}

/**
 * Modal state manager - handles container, overlay, and content together
 * @param {Object} targets - Object containing modal targets
 * @param {HTMLElement} targets.container - Container element
 * @param {HTMLElement} targets.overlay - Overlay element
 * @param {HTMLElement} targets.content - Content element
 * @param {boolean} open - Whether modal is open
 */
export function syncModalState(targets, open) {
  const state = open ? 'open' : 'closed'

  if (targets.container) {
    setState(targets.container, state)
  }

  if (targets.overlay) {
    setState(targets.overlay, state)
  }

  if (targets.content) {
    setState(content, state)
  }
}

/**
 * Create a state synchronizer for a component
 * Returns an object with methods to manage state
 * @param {HTMLElement} element - Main element
 * @param {Object} config - Configuration
 * @param {string} config.openState - State when open (default: 'open')
 * @param {string} config.closedState - State when closed (default: 'closed')
 * @param {string} config.ariaAttribute - ARIA attribute to sync
 * @param {HTMLElement[]} config.syncTargets - Additional elements to sync
 */
export function createStateSynchronizer(element, config = {}) {
  const {
    openState = 'open',
    closedState = 'closed',
    ariaAttribute = null,
    syncTargets = []
  } = config

  return {
    element,

    open() {
      setState(element, openState, { ariaAttribute, ariaValue: true })
      syncTargets.forEach(target => setState(target, openState))
    },

    close() {
      setState(element, closedState, { ariaAttribute, ariaValue: false })
      syncTargets.forEach(target => setState(target, closedState))
    },

    toggle() {
      const isCurrentlyOpen = getState(element) === openState
      if (isCurrentlyOpen) {
        this.close()
      } else {
        this.open()
      }
      return !isCurrentlyOpen
    },

    isOpen() {
      return getState(element) === openState
    },

    getState() {
      return getState(element)
    }
  }
}
