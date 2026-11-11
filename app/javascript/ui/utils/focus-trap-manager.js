/**
 * Focus Trap Manager
 *
 * Tabbable detection, initial focus and a stackable Tab trap for modal
 * components (dialog, alert dialog, drawer, command dialog, sheet).
 * Most controllers should use `createModalSession` (modal-session.js), which
 * combines this with focus restore, the inert background and the Escape stack.
 *
 *   getTabbableElements(content)          // what Tab would visit, in order
 *   focusInitial(content, { preferredElement: this.cancelTarget })
 *   const trap = createFocusTrap(content)
 *   trap.activate() ... trap.deactivate()
 */

// Candidates; the filter in isTabbable() does the real work.
const CANDIDATE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "iframe",
  "summary",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]"
].join(", ")

// Input elements that trigger the mobile keyboard
const INPUT_SELECTOR = "input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']), textarea"

/**
 * Whether Tab can reach the element: not disabled, not a hidden input, not
 * tabindex < 0, not inside `[hidden]` / `[inert]`, and actually rendered
 * (not display:none / visibility:hidden).
 *
 * @param {Element} element
 * @returns {boolean}
 */
export function isTabbable(element) {
  if (!element || !element.matches(CANDIDATE_SELECTOR)) return false

  const tabindex = element.getAttribute("tabindex")
  if (tabindex !== null && parseInt(tabindex, 10) < 0) return false
  if (element.matches(":disabled")) return false
  if (element.localName === "input" && element.type === "hidden") return false
  if (element.closest("[hidden], [inert]")) return false
  if (element.closest("fieldset[disabled]") && !element.closest("legend")) return false

  return isRendered(element)
}

/**
 * Whether the element is focusable at all, including tabindex="-1"
 * (used to check a focus-restore target).
 */
export function isFocusable(element) {
  if (!element || typeof element.focus !== "function" || !element.isConnected) return false
  if (element === document.body) return false
  if (element.closest("[inert], [hidden]")) return false
  if (element.matches(":disabled")) return false
  return isRendered(element)
}

function isRendered(element) {
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility({ visibilityProperty: true })
  }
  return element.getClientRects().length > 0
}

/**
 * All tabbable elements inside a container, in DOM order.
 * @param {Element} container
 * @returns {HTMLElement[]}
 */
export function getTabbableElements(container) {
  if (!container) return []
  return Array.from(container.querySelectorAll(CANDIDATE_SELECTOR)).filter(isTabbable)
}

/** @deprecated alias of getTabbableElements */
export function getFocusableElements(container) {
  return getTabbableElements(container)
}

/**
 * First tabbable element in a container.
 * @param {Element} container
 * @param {Object} options
 * @param {boolean} options.skipInputs - prefer a non-text-input (mobile)
 */
export function getFirstFocusable(container, options = {}) {
  const elements = getTabbableElements(container)

  if (options.skipInputs) {
    return elements.find(el => !el.matches(INPUT_SELECTOR)) || elements[0] || null
  }

  return elements[0] || null
}

/** Last tabbable element in a container. */
export function getLastFocusable(container) {
  const elements = getTabbableElements(container)
  return elements[elements.length - 1] || null
}

/** Whether the current device is a phone/tablet. */
export function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

/**
 * Move focus into a container on open. Order:
 * 1. `preferredElement` (element or function returning one), when focusable
 * 2. an `[autofocus]` element inside the container
 * 3. the first tabbable element (on mobile, skipping text inputs so the
 *    keyboard doesn't pop up — when `mobileAware`)
 * 4. the container itself, given tabindex="-1" if it has no tabindex
 *
 * @param {HTMLElement} container
 * @param {Object} options
 * @param {HTMLElement|Function} options.preferredElement
 * @param {boolean} options.mobileAware - default true
 * @param {boolean} options.preventScroll
 * @returns {HTMLElement|null} the element that received focus
 */
export function focusInitial(container, options = {}) {
  if (!container) return null
  const { mobileAware = true, preventScroll = false } = options
  const focusOptions = preventScroll ? { preventScroll: true } : undefined

  const preferred = resolve(options.preferredElement)
  const autofocus = container.querySelector("[autofocus]")
  const skipInputs = mobileAware && isMobileDevice()

  const candidates = [
    preferred && container.contains(preferred) ? preferred : null,
    autofocus,
    getFirstFocusable(container, { skipInputs })
  ]

  for (const candidate of candidates) {
    if (candidate && isFocusable(candidate)) {
      candidate.focus(focusOptions)
      if (document.activeElement === candidate) return candidate
    }
  }

  if (!container.hasAttribute("tabindex")) container.setAttribute("tabindex", "-1")
  container.focus(focusOptions)
  return document.activeElement === container ? container : null
}

/**
 * @deprecated Use focusInitial. Kept for existing callers; same order, and
 * `excludeInputsOnMobile` is still accepted as an alias of `mobileAware`.
 */
export function focusFirstElement(container, options = {}) {
  const { mobileAware = true, excludeInputsOnMobile = mobileAware } = options
  return focusInitial(container, { ...options, mobileAware: excludeInputsOnMobile })
}

// --- Trap stack -------------------------------------------------------------
// Only the most recently activated trap handles Tab, so a modal opened from
// inside another modal traps focus in itself and hands back when it closes.

const traps = []
let listening = false

function handleTabKey(event) {
  if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return
  // Drop traps whose container left the DOM without deactivate()
  for (let i = traps.length - 1; i >= 0; i--) {
    if (!traps[i].container.isConnected) traps.splice(i, 1)
  }
  const top = traps[traps.length - 1]
  if (top) top.handleTab(event)
}

function updateListener() {
  if (traps.length && !listening) {
    document.addEventListener("keydown", handleTabKey)
    listening = true
  } else if (!traps.length && listening) {
    document.removeEventListener("keydown", handleTabKey)
    listening = false
  }
}

/**
 * Trap Tab / Shift+Tab inside a container: from the last tabbable Tab wraps
 * to the first, from the first (or the container) Shift+Tab wraps to the
 * last; with nothing tabbable, focus stays on the container. Focus outside
 * the container (e.g. a popover portaled to <body>) is left alone.
 *
 * The trap only handles keys. Initial focus and restoring focus are
 * separate (`focusInitial`, or `createModalSession` for everything).
 *
 * @param {HTMLElement} container
 * @returns {{activate: Function, deactivate: Function, isActive: Function}}
 */
export function createFocusTrap(container, _options = {}) {
  const trap = {
    container,
    handleTab(event) {
      const active = document.activeElement
      if (!container.contains(active)) return

      const tabbables = getTabbableElements(container)
      if (tabbables.length === 0) {
        event.preventDefault()
        container.focus()
        return
      }

      const first = tabbables[0]
      const last = tabbables[tabbables.length - 1]

      if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  return {
    activate() {
      const index = traps.indexOf(trap)
      if (index !== -1) traps.splice(index, 1)
      traps.push(trap)
      updateListener()
    },

    deactivate() {
      const index = traps.indexOf(trap)
      if (index !== -1) traps.splice(index, 1)
      updateListener()
    },

    isActive() {
      return traps.includes(trap)
    },

    /** Focus the first tabbable element (or the container). */
    focusFirst() {
      focusInitial(container, { mobileAware: false })
    },

    /** Focus the last tabbable element. */
    focusLast() {
      const element = getLastFocusable(container)
      if (element) element.focus()
    }
  }
}

/**
 * Drop every trap (test helper, like resetScrollLockState).
 */
export function resetFocusTraps() {
  traps.length = 0
  updateListener()
}

/**
 * @deprecated Returns a cleanup function that deactivates a trap.
 */
export function trapFocus(container, options = {}) {
  const trap = createFocusTrap(container, options)
  trap.activate()
  return () => trap.deactivate()
}

function resolve(value) {
  return typeof value === "function" ? value() : value
}
