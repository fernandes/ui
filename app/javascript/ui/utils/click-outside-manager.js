/**
 * Click Outside Manager Utility
 *
 * Handles detection of clicks outside a specified element.
 * Used by dropdown, select, popover, and other overlay components.
 */

/**
 * Create a click-outside handler
 * @param {HTMLElement|HTMLElement[]} elements - Element(s) to monitor (clicks inside these are ignored)
 * @param {Function} onClickOutside - Callback when click occurs outside
 * @param {Object} options - Configuration options
 * @param {boolean} options.capture - Use capture phase (default: false)
 * @param {string[]} options.ignoreSelectors - CSS selectors to ignore (e.g., '[data-ignore-click-outside]')
 * @param {boolean} options.mousedown - Listen to mousedown instead of click (default: false)
 * @returns {Object} Handler object with attach/detach methods
 */
export function createClickOutsideHandler(elements, onClickOutside, options = {}) {
  const {
    capture = false,
    ignoreSelectors = [],
    mousedown = false
  } = options

  const elementsArray = Array.isArray(elements) ? elements : [elements]
  let handler = null
  let isAttached = false

  const eventType = mousedown ? 'mousedown' : 'click'

  const clickHandler = (event) => {
    const target = event.target

    // Check if click is inside any of the monitored elements
    const isInside = elementsArray.some(element => {
      return element && element.contains(target)
    })

    if (isInside) return

    // Check if click is on an ignored element
    const isIgnored = ignoreSelectors.some(selector => {
      return target.closest(selector) !== null
    })

    if (isIgnored) return

    onClickOutside(event)
  }

  return {
    /**
     * Attach the click-outside listener
     */
    attach() {
      if (isAttached) return

      handler = clickHandler
      document.addEventListener(eventType, handler, capture)
      isAttached = true
    },

    /**
     * Detach the click-outside listener
     */
    detach() {
      if (!isAttached || !handler) return

      document.removeEventListener(eventType, handler, capture)
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
     * Update the elements being monitored
     * @param {HTMLElement|HTMLElement[]} newElements
     */
    updateElements(newElements) {
      elementsArray.length = 0
      const newArray = Array.isArray(newElements) ? newElements : [newElements]
      elementsArray.push(...newArray)
    }
  }
}

/**
 * Simple one-liner to setup click-outside handler
 * Returns cleanup function
 * @param {HTMLElement|HTMLElement[]} elements - Element(s) to monitor
 * @param {Function} onClickOutside - Callback when click occurs outside
 * @param {Object} options - Configuration options
 * @returns {Function} Cleanup function to remove listener
 */
export function onClickOutside(elements, onClickOutside, options = {}) {
  const handler = createClickOutsideHandler(elements, onClickOutside, options)
  handler.attach()
  return () => handler.detach()
}

/**
 * Setup click-outside handler that only triggers when a condition is true
 * @param {HTMLElement|HTMLElement[]} elements - Element(s) to monitor
 * @param {Function} onClickOutside - Callback when click occurs outside
 * @param {Function} condition - Function that returns whether handler should trigger
 * @returns {Function} Cleanup function
 */
export function onClickOutsideWhen(elements, onClickOutside, condition) {
  const elementsArray = Array.isArray(elements) ? elements : [elements]

  const clickHandler = (event) => {
    if (!condition()) return

    const target = event.target
    const isInside = elementsArray.some(element => {
      return element && element.contains(target)
    })

    if (!isInside) {
      onClickOutside(event)
    }
  }

  document.addEventListener('click', clickHandler)
  return () => document.removeEventListener('click', clickHandler)
}
