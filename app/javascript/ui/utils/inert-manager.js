/**
 * Inert Manager — make everything outside a modal inert
 *
 * Walks from the element that must stay live up to <body> and sets `inert`
 * on every sibling along the way (Radix `hideOthers`, using `inert` so the
 * background is both hidden from screen readers and unreachable by Tab or
 * pointer). Calls stack: the most recent call decides what is inert, so a
 * modal opened from inside another works, and releasing it gives the outer
 * modal its background back. Elements that were already inert are left
 * inert on release.
 *
 *   const release = inertOthers(this.containerTarget)
 *   ...
 *   release()
 *
 * Not touched: <script>, <style>, <template> and friends, and live regions
 * (`[aria-live]`), so toasts keep announcing. Elements appended to the page
 * after the call (e.g. a popover portaled to <body>) stay interactive.
 */

const SKIP_SELECTOR = "script, style, template, link, meta, noscript, [aria-live]"
const MARKER = "data-ui-inert"

const stack = []
// element -> whether it was inert before we touched it
const managed = new Map()

/**
 * @param {Element} keep - element (with its subtree) that stays interactive
 * @returns {Function} release — undoes this call; safe to call twice
 */
export function inertOthers(keep) {
  if (!keep || !keep.isConnected) return () => {}

  const entry = { keep }
  stack.push(entry)
  apply()
  listenForTurboCache()

  return () => {
    const index = stack.indexOf(entry)
    if (index === -1) return
    stack.splice(index, 1)
    apply()
  }
}

/** Number of active inertOthers() calls (for tests and debugging). */
export function getInertLayerCount() {
  return stack.length
}

/**
 * Release every inertOthers() call (test helper, like resetScrollLockState).
 */
export function resetInert() {
  stack.length = 0
  apply()
}

function apply() {
  // Drop entries whose element left the DOM without releasing
  for (let i = stack.length - 1; i >= 0; i--) {
    if (!stack[i].keep.isConnected) stack.splice(i, 1)
  }

  const top = stack[stack.length - 1]
  const targets = top ? siblingsAlongPath(top.keep) : new Set()

  for (const [element, wasInert] of managed) {
    if (!targets.has(element)) {
      element.inert = wasInert
      element.removeAttribute(MARKER)
      managed.delete(element)
    }
  }

  for (const element of targets) {
    if (managed.has(element)) continue
    // A marker without an entry is left over from a Turbo snapshot: ours.
    const wasInert = element.hasAttribute(MARKER) ? false : element.inert
    managed.set(element, wasInert)
    element.inert = true
    element.setAttribute(MARKER, "")
  }
}

function siblingsAlongPath(keep) {
  const result = new Set()
  let node = keep

  while (node && node !== document.body && node.parentElement) {
    for (const sibling of node.parentElement.children) {
      if (sibling !== node && !sibling.matches(SKIP_SELECTOR)) result.add(sibling)
    }
    node = node.parentElement
  }

  return result
}

// Turbo snapshots the page before navigating; don't let the snapshot keep a
// dead, inert background if a modal was open.
let turboListener = false
function listenForTurboCache() {
  if (turboListener) return
  turboListener = true
  document.addEventListener("turbo:before-cache", () => {
    stack.length = 0
    apply()
  })
}
