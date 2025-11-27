/**
 * Floating UI Positioner Utility
 *
 * Encapsulates Floating UI positioning logic.
 * Used by popover, dropdown, tooltip, select, hover_card, etc.
 */

import { computePosition, flip, offset, shift, arrow, autoUpdate } from "@floating-ui/dom"

/**
 * Default configuration for positioning
 */
const DEFAULT_CONFIG = {
  placement: 'bottom',
  offsetValue: 4,
  flipEnabled: true,
  shiftEnabled: true,
  shiftPadding: 8,
  arrowElement: null,
  arrowPadding: 8,
  strategy: 'absolute',
  // autoUpdate options
  ancestorScroll: true,
  ancestorResize: true,
  elementResize: true,
  layoutShift: true,
  animationFrame: false
}

/**
 * Build middleware array based on options
 * @param {Object} options - Configuration options
 * @returns {Array} Middleware array
 */
function buildMiddleware(options) {
  const middleware = []

  // Offset middleware
  if (options.offsetValue > 0) {
    middleware.push(offset(options.offsetValue))
  }

  // Flip middleware
  if (options.flipEnabled) {
    middleware.push(flip())
  }

  // Shift middleware
  if (options.shiftEnabled) {
    middleware.push(shift({ padding: options.shiftPadding }))
  }

  // Arrow middleware
  if (options.arrowElement) {
    middleware.push(arrow({
      element: options.arrowElement,
      padding: options.arrowPadding
    }))
  }

  return middleware
}

/**
 * Apply position to content element
 * @param {HTMLElement} content - Content element
 * @param {Object} position - Position data from computePosition
 * @param {Object} options - Options
 */
function applyPosition(content, position, options = {}) {
  const { x, y, placement, middlewareData } = position

  // Apply position styles
  Object.assign(content.style, {
    left: `${x}px`,
    top: `${y}px`,
    position: options.strategy || 'absolute'
  })

  // Update data attributes
  const [side, align] = placement.split('-')
  content.setAttribute('data-side', side)
  if (align) {
    content.setAttribute('data-align', align)
  }

  // Position arrow if present
  if (options.arrowElement && middlewareData.arrow) {
    const { x: arrowX, y: arrowY } = middlewareData.arrow

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right'
    }[side]

    Object.assign(options.arrowElement.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      right: '',
      bottom: '',
      [staticSide]: '-4px'
    })
  }
}

/**
 * Create a floating UI positioner
 * @param {HTMLElement} reference - Reference/trigger element
 * @param {HTMLElement} floating - Floating/content element
 * @param {Object} options - Configuration options
 * @returns {Object} Positioner controller
 */
export function createPositioner(reference, floating, options = {}) {
  const config = { ...DEFAULT_CONFIG, ...options }
  let cleanup = null
  let isActive = false

  const middleware = buildMiddleware(config)

  const updatePosition = async () => {
    const position = await computePosition(reference, floating, {
      placement: config.placement,
      middleware,
      strategy: config.strategy
    })

    applyPosition(floating, position, {
      strategy: config.strategy,
      arrowElement: config.arrowElement
    })

    return position
  }

  return {
    /**
     * Start positioning with auto-update
     */
    start() {
      if (isActive) return

      // Initial position update
      updatePosition()

      // Setup auto-update
      cleanup = autoUpdate(reference, floating, updatePosition, {
        ancestorScroll: config.ancestorScroll,
        ancestorResize: config.ancestorResize,
        elementResize: config.elementResize,
        layoutShift: config.layoutShift,
        animationFrame: config.animationFrame
      })

      isActive = true
    },

    /**
     * Stop positioning and cleanup
     */
    stop() {
      if (!isActive) return

      if (cleanup) {
        cleanup()
        cleanup = null
      }

      isActive = false
    },

    /**
     * Manually update position once
     * @returns {Promise<Object>} Position data
     */
    async update() {
      return updatePosition()
    },

    /**
     * Update placement
     * @param {string} placement - New placement
     */
    setPlacement(placement) {
      config.placement = placement
      if (isActive) {
        updatePosition()
      }
    },

    /**
     * Update offset
     * @param {number} offsetValue - New offset value
     */
    setOffset(offsetValue) {
      config.offsetValue = offsetValue
      // Rebuild middleware with new offset
      middleware.length = 0
      middleware.push(...buildMiddleware(config))
      if (isActive) {
        updatePosition()
      }
    },

    /**
     * Check if positioner is active
     * @returns {boolean}
     */
    isActive() {
      return isActive
    },

    /**
     * Get current configuration
     * @returns {Object}
     */
    getConfig() {
      return { ...config }
    }
  }
}

/**
 * Simple one-liner to position and auto-update
 * Returns cleanup function
 * @param {HTMLElement} reference - Reference element
 * @param {HTMLElement} floating - Floating element
 * @param {Object} options - Configuration options
 * @returns {Function} Cleanup function
 */
export function position(reference, floating, options = {}) {
  const positioner = createPositioner(reference, floating, options)
  positioner.start()
  return () => positioner.stop()
}

/**
 * Position once without auto-update
 * @param {HTMLElement} reference - Reference element
 * @param {HTMLElement} floating - Floating element
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} Position data
 */
export async function positionOnce(reference, floating, options = {}) {
  const config = { ...DEFAULT_CONFIG, ...options }
  const middleware = buildMiddleware(config)

  const position = await computePosition(reference, floating, {
    placement: config.placement,
    middleware,
    strategy: config.strategy
  })

  applyPosition(floating, position, {
    strategy: config.strategy,
    arrowElement: config.arrowElement
  })

  return position
}

/**
 * Get placement from data attributes
 * @param {HTMLElement} element - Element with data-side and data-align attributes
 * @returns {string} Floating UI placement string
 */
export function getPlacementFromAttributes(element) {
  const side = element.getAttribute('data-side') || 'bottom'
  const align = element.getAttribute('data-align')
  return align ? `${side}-${align}` : side
}

/**
 * Parse side and align from placement
 * @param {string} placement - Floating UI placement string
 * @returns {Object} Object with side and align properties
 */
export function parsePlacement(placement) {
  const [side, align = 'center'] = placement.split('-')
  return { side, align }
}
