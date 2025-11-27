/**
 * Focus Trap Manager Utility
 *
 * Handles focus trapping within modal components.
 * Used by dialog, alert_dialog, drawer, responsive_dialog, etc.
 */

// Focusable elements selector
const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ')

// Input elements that trigger mobile keyboard
const INPUT_SELECTOR = 'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea'

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - Container to search within
 * @returns {HTMLElement[]} Array of focusable elements
 */
export function getFocusableElements(container) {
  if (!container) return []
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
}

/**
 * Get the first focusable element in a container
 * @param {HTMLElement} container - Container to search within
 * @param {Object} options - Options
 * @param {boolean} options.skipInputs - Skip text inputs (useful for mobile to avoid keyboard popup)
 * @returns {HTMLElement|null}
 */
export function getFirstFocusable(container, options = {}) {
  const elements = getFocusableElements(container)

  if (options.skipInputs) {
    const nonInput = elements.find(el => !el.matches(INPUT_SELECTOR))
    return nonInput || elements[0] || null
  }

  return elements[0] || null
}

/**
 * Get the last focusable element in a container
 * @param {HTMLElement} container - Container to search within
 * @returns {HTMLElement|null}
 */
export function getLastFocusable(container) {
  const elements = getFocusableElements(container)
  return elements[elements.length - 1] || null
}

/**
 * Check if the current device is mobile
 * @returns {boolean}
 */
export function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

/**
 * Focus the first appropriate element in a container
 * @param {HTMLElement} container - Container to focus within
 * @param {Object} options - Options
 * @param {boolean} options.mobileAware - Skip inputs on mobile to avoid keyboard popup
 * @param {HTMLElement} options.preferredElement - Specific element to focus if available
 */
export function focusFirstElement(container, options = {}) {
  const { mobileAware = true, preferredElement = null } = options

  // Try preferred element first
  if (preferredElement && container.contains(preferredElement)) {
    preferredElement.focus()
    return preferredElement
  }

  // On mobile, skip text inputs to avoid keyboard popup
  const skipInputs = mobileAware && isMobileDevice()
  const element = getFirstFocusable(container, { skipInputs })

  if (element) {
    element.focus()
    return element
  }

  return null
}

/**
 * Create a focus trap for a container
 * @param {HTMLElement} container - Container to trap focus within
 * @param {Object} options - Options
 * @param {boolean} options.mobileAware - Handle mobile devices specially
 * @param {HTMLElement} options.returnFocus - Element to return focus to on deactivate
 * @param {boolean} options.autoFocus - Whether to auto-focus first element on activate
 * @returns {Object} Focus trap controller
 */
export function createFocusTrap(container, options = {}) {
  const {
    mobileAware = true,
    returnFocus = null,
    autoFocus = true
  } = options

  let isActive = false
  let previouslyFocused = null
  let tabHandler = null

  const handleTab = (event) => {
    if (event.key !== 'Tab') return

    const focusableElements = getFocusableElements(container)
    if (focusableElements.length === 0) return

    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      // Shift+Tab: if on first element, go to last
      if (document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
      }
    } else {
      // Tab: if on last element, go to first
      if (document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }
  }

  return {
    /**
     * Activate the focus trap
     */
    activate() {
      if (isActive) return

      // Store currently focused element
      previouslyFocused = returnFocus || document.activeElement

      // Add tab key handler
      tabHandler = handleTab
      document.addEventListener('keydown', tabHandler)

      // Focus first element
      if (autoFocus) {
        // Delay to allow DOM to settle
        requestAnimationFrame(() => {
          focusFirstElement(container, { mobileAware })
        })
      }

      isActive = true
    },

    /**
     * Deactivate the focus trap and optionally return focus
     */
    deactivate() {
      if (!isActive) return

      // Remove tab handler
      if (tabHandler) {
        document.removeEventListener('keydown', tabHandler)
        tabHandler = null
      }

      // Return focus to previously focused element
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus()
      }

      previouslyFocused = null
      isActive = false
    },

    /**
     * Check if trap is active
     * @returns {boolean}
     */
    isActive() {
      return isActive
    },

    /**
     * Update the return focus element
     * @param {HTMLElement} element
     */
    setReturnFocus(element) {
      previouslyFocused = element
    },

    /**
     * Manually focus first element
     */
    focusFirst() {
      focusFirstElement(container, { mobileAware })
    },

    /**
     * Manually focus last element
     */
    focusLast() {
      const element = getLastFocusable(container)
      if (element) element.focus()
    }
  }
}

/**
 * Simple one-liner to setup focus trap
 * Returns cleanup function
 * @param {HTMLElement} container - Container to trap focus within
 * @param {Object} options - Options for createFocusTrap
 * @returns {Function} Cleanup function to deactivate trap
 */
export function trapFocus(container, options = {}) {
  const trap = createFocusTrap(container, options)
  trap.activate()
  return () => trap.deactivate()
}
