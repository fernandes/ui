/**
 * Modal Session — everything a modal needs while it is open, in one object
 *
 * activate():   remembers the focused element, makes the background inert,
 *               locks body scroll, traps Tab, pushes an Escape layer and
 *               moves focus into the content.
 * deactivate(): undoes all of it in reverse and puts focus back where it was
 *               (Radix Dialog = FocusScope trapped + hideOthers +
 *               RemoveScroll + DismissableLayer).
 *
 *   this.session = createModalSession({
 *     content: this.contentTarget,              // role="dialog" element
 *     isolate: this.containerTarget,            // stays live (overlay + content)
 *     returnFocus: () => this.triggerTargets[0],
 *     onEscape: () => this.close()
 *   })
 *   show()       { ...set data-state=open, content.inert = false; this.session.activate() }
 *   hide()       { this.session.deactivate(); ...set data-state=closed, content.inert = true }
 *   disconnect() { this.session.deactivate({ restoreFocus: false }) }
 *
 * Call activate() after the content is visible and not inert (initial
 * focus needs a rendered target), and deactivate() before making it inert
 * again. Both are idempotent.
 */

import { createEscapeLayer } from "./escape-key-manager.js"
import { createFocusTrap, focusInitial, isFocusable } from "./focus-trap-manager.js"
import { inertOthers } from "./inert-manager.js"
import { lockScroll, unlockScroll } from "./scroll-lock-manager.js"

/**
 * @param {Object} options
 * @param {HTMLElement} options.content - the dialog element; focus is trapped in it
 * @param {HTMLElement} [options.isolate=content] - subtree kept interactive;
 *   everything else becomes inert. Pass the wrapper that holds the overlay
 *   too, or overlay clicks stop working.
 * @param {HTMLElement|Function} [options.initialFocus] - preferred element to
 *   focus on open (falls back to [autofocus], first tabbable, the content)
 * @param {HTMLElement|Function} [options.returnFocus] - focused on close when
 *   the element focused at activate() is gone, was <body>, or can't be focused
 *   (e.g. Safari doesn't focus buttons on click: pass the trigger)
 * @param {Function|null} [options.onEscape] - Escape handler; when given, an
 *   Escape layer is active while open. Pass `() => {}` to block Escape
 *   without closing; omit (null) for no Escape handling at all.
 * @param {boolean} [options.trapFocus=true]
 * @param {boolean} [options.inertBackground=true]
 * @param {boolean} [options.lockScroll=true]
 * @param {boolean} [options.autoFocus=true] - move focus in on activate()
 * @param {boolean} [options.mobileAware=true] - skip text inputs for initial
 *   focus on mobile (keeps the keyboard closed)
 */
export function createModalSession(options = {}) {
  const {
    content,
    isolate = content,
    initialFocus = null,
    returnFocus = null,
    onEscape = null,
    trapFocus = true,
    inertBackground = true,
    lockScroll: shouldLockScroll = true,
    autoFocus = true,
    mobileAware = true
  } = options

  const trap = content ? createFocusTrap(content) : null
  const escapeLayer = onEscape ? createEscapeLayer(onEscape, { element: content }) : null

  let active = false
  let previouslyFocused = null
  let releaseInert = null
  let scrollLocked = false
  let focusFrame = null

  // Content that fades in with a CSS transition on `visibility` (our
  // `data-[state=closed]:invisible` + `duration-*` classes) still computes as
  // hidden on the frame it opens, and the browser refuses to focus it. Retry
  // on the next frames until focus lands inside (or the session ends).
  function moveFocusIn(framesLeft = 30) {
    focusFrame = null
    if (!active || content.contains(document.activeElement)) return

    focusInitial(content, { preferredElement: initialFocus, mobileAware })

    if (!content.contains(document.activeElement) && framesLeft > 0) {
      focusFrame = requestAnimationFrame(() => moveFocusIn(framesLeft - 1))
    }
  }

  return {
    activate() {
      if (active || !content) return
      active = true

      previouslyFocused = document.activeElement

      if (inertBackground) releaseInert = inertOthers(isolate)
      if (shouldLockScroll) {
        lockScroll()
        scrollLocked = true
      }
      if (trapFocus) trap.activate()
      if (escapeLayer) escapeLayer.activate()

      if (autoFocus) moveFocusIn()
    },

    /**
     * @param {Object} opts
     * @param {boolean} [opts.restoreFocus=true] - false on disconnect
     */
    deactivate({ restoreFocus = true } = {}) {
      if (!active) return
      active = false

      if (focusFrame !== null) {
        cancelAnimationFrame(focusFrame)
        focusFrame = null
      }
      if (escapeLayer) escapeLayer.deactivate()
      if (trap) trap.deactivate()
      if (scrollLocked) {
        unlockScroll()
        scrollLocked = false
      }
      if (releaseInert) {
        releaseInert()
        releaseInert = null
      }

      const saved = previouslyFocused
      previouslyFocused = null
      if (!restoreFocus) return

      const target = [saved, resolve(returnFocus)].find(el => el && isFocusable(el) && !content.contains(el))
      if (target) target.focus()
    },

    isActive() {
      return active
    }
  }
}

function resolve(value) {
  return typeof value === "function" ? value() : value
}
