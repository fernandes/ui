/**
 * Escape Key Manager Utility
 *
 * Handles escape key binding and cleanup for modal components.
 * Used by dialog, alert_dialog, popover, tooltip, drawer, responsive_dialog, etc.
 */

/**
 * Create an escape key handler
 * @param {Function} onEscape - Callback to execute when escape is pressed
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether handler is enabled (default: true)
 * @param {boolean} options.stopPropagation - Whether to stop event propagation (default: false)
 * @param {boolean} options.preventDefault - Whether to prevent default behavior (default: false)
 * @returns {Object} Handler object with attach/detach methods
 */
export function createEscapeKeyHandler(onEscape, options = {}) {
  const {
    enabled = true,
    stopPropagation = false,
    preventDefault = false
  } = options

  let handler = null
  let isAttached = false

  const keydownHandler = (event) => {
    if (event.key === 'Escape') {
      if (stopPropagation) {
        event.stopPropagation()
      }
      if (preventDefault) {
        event.preventDefault()
      }
      onEscape(event)
    }
  }

  return {
    /**
     * Attach the escape key listener
     */
    attach() {
      if (!enabled || isAttached) return

      handler = keydownHandler
      document.addEventListener('keydown', handler)
      isAttached = true
    },

    /**
     * Detach the escape key listener
     */
    detach() {
      if (!isAttached || !handler) return

      document.removeEventListener('keydown', handler)
      handler = null
      isAttached = false
    },

    /**
     * Check if handler is currently attached
     * @returns {boolean}
     */
    isAttached() {
      return isAttached
    },

    /**
     * Temporarily disable the handler without detaching
     */
    disable() {
      if (handler) {
        document.removeEventListener('keydown', handler)
      }
    },

    /**
     * Re-enable a disabled handler
     */
    enable() {
      if (handler && isAttached) {
        document.addEventListener('keydown', handler)
      }
    }
  }
}

/**
 * Simple one-liner to setup escape handler
 * Returns cleanup function
 * @param {Function} onEscape - Callback to execute
 * @param {Object} options - Configuration options
 * @returns {Function} Cleanup function to remove listener
 */
export function onEscapeKey(onEscape, options = {}) {
  const handler = createEscapeKeyHandler(onEscape, options)
  handler.attach()
  return () => handler.detach()
}

/**
 * Setup escape handler only when a condition is true
 * @param {Function} onEscape - Callback to execute
 * @param {Function} condition - Function that returns whether handler should be active
 * @returns {Function} Cleanup function
 */
export function onEscapeKeyWhen(onEscape, condition) {
  const keydownHandler = (event) => {
    if (event.key === 'Escape' && condition()) {
      onEscape(event)
    }
  }

  document.addEventListener('keydown', keydownHandler)
  return () => document.removeEventListener('keydown', keydownHandler)
}
