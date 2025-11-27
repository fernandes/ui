/**
 * Scroll Lock Manager Utility
 *
 * Manages body scroll locking for modal components.
 * Used by dialog, alert_dialog, drawer, etc.
 */

// Track scroll lock count to handle nested modals
let scrollLockCount = 0
let originalOverflow = ''
let originalPaddingRight = ''

/**
 * Get the scrollbar width
 * @returns {number} Scrollbar width in pixels
 */
function getScrollbarWidth() {
  const scrollDiv = document.createElement('div')
  scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;'
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

/**
 * Check if the document has a scrollbar
 * @returns {boolean}
 */
function hasScrollbar() {
  return document.documentElement.scrollHeight > document.documentElement.clientHeight
}

/**
 * Lock body scroll
 * Handles nested modal scenario by tracking lock count
 * @param {Object} options - Options
 * @param {boolean} options.reserveScrollBarGap - Prevent layout shift by reserving scrollbar width (default: true)
 */
export function lockScroll(options = {}) {
  const { reserveScrollBarGap = true } = options

  scrollLockCount++

  // Only apply styles on first lock
  if (scrollLockCount === 1) {
    originalOverflow = document.body.style.overflow
    originalPaddingRight = document.body.style.paddingRight

    document.body.style.overflow = 'hidden'
    document.body.setAttribute('data-scroll-locked', '1')

    // Prevent layout shift by compensating for scrollbar
    if (reserveScrollBarGap && hasScrollbar()) {
      const scrollbarWidth = getScrollbarWidth()
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    }
  }
}

/**
 * Unlock body scroll
 * Only unlocks when all locks are released (nested modal support)
 */
export function unlockScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1)

  // Only restore styles when all locks released
  if (scrollLockCount === 0) {
    document.body.style.overflow = originalOverflow
    document.body.style.paddingRight = originalPaddingRight
    document.body.removeAttribute('data-scroll-locked')

    originalOverflow = ''
    originalPaddingRight = ''
  }
}

/**
 * Force unlock scroll (use with caution - bypasses lock count)
 */
export function forceUnlockScroll() {
  scrollLockCount = 0
  document.body.style.overflow = originalOverflow || ''
  document.body.style.paddingRight = originalPaddingRight || ''
  document.body.removeAttribute('data-scroll-locked')

  originalOverflow = ''
  originalPaddingRight = ''
}

/**
 * Check if scroll is currently locked
 * @returns {boolean}
 */
export function isScrollLocked() {
  return scrollLockCount > 0
}

/**
 * Get current lock count
 * @returns {number}
 */
export function getScrollLockCount() {
  return scrollLockCount
}

/**
 * Reset scroll lock state (for testing purposes)
 * This should only be used in test environments
 */
export function resetScrollLockState() {
  scrollLockCount = 0
  originalOverflow = ''
  originalPaddingRight = ''
}

/**
 * Create a scroll lock that automatically unlocks when returned function is called
 * @param {Object} options - Options for lockScroll
 * @returns {Function} Cleanup function to unlock
 */
export function createScrollLock(options = {}) {
  lockScroll(options)
  return () => unlockScroll()
}

/**
 * Prevent touch scroll on mobile while allowing drawer drag
 * @param {HTMLElement} allowedElement - Element where touch scrolling is allowed
 * @returns {Function} Cleanup function
 */
export function preventTouchScroll(allowedElement = null) {
  const handler = (event) => {
    // Allow scrolling inside the specified element
    if (allowedElement && allowedElement.contains(event.target)) {
      return
    }
    event.preventDefault()
  }

  document.addEventListener('touchmove', handler, { passive: false })

  return () => {
    document.removeEventListener('touchmove', handler)
  }
}
