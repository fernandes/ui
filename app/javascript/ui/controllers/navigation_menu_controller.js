import { Controller } from "@hotwired/stimulus"
import { ensureId, setIdRefs } from "../utils/id-manager.js"
import { createEscapeLayer } from "../utils/escape-key-manager.js"
import { getTabbableElements } from "../utils/focus-trap-manager.js"

const CONTENT_TABBABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Longest exit animation we wait for before hiding a panel anyway
const EXIT_FALLBACK_MS = 500

/**
 * NavigationMenu Controller
 *
 * Implements the navigation menu pattern with hover/focus activation
 * and keyboard navigation.
 *
 * Based on Radix UI NavigationMenu:
 * https://www.radix-ui.com/primitives/docs/components/navigation-menu
 *
 * A11y:
 * - It's navigation, not a composite widget: every trigger and top-level
 *   link is a Tab stop. Arrow keys move between them as an enhancement, and
 *   between the links of an open panel.
 * - Each trigger has aria-controls → its content; the content is labelled
 *   by its trigger (per-instance ids).
 * - Viewport mode moves the real content node into the viewport while open
 *   (no copies, so links and ids stay unique) and moves it back when closed.
 *   Tab from an open trigger enters its content; Tab from the last link
 *   leaves to whatever follows the trigger.
 * - Closed panels are hidden even when no exit animation runs.
 * - Escape (layered) closes and returns focus to the trigger; focus leaving
 *   the open item, an outside click, or following a link closes it.
 */
export default class extends Controller {
  static targets = ["trigger", "content", "viewport", "item"]
  static values = {
    viewport: { type: Boolean, default: true },
    delayDuration: { type: Number, default: 200 },
    skipDelayDuration: { type: Number, default: 300 },
    activeIndex: { type: Number, default: -1 },
    previousIndex: { type: Number, default: -1 }
  }

  connect() {
    this.openTimerRef = null
    this.closeTimerRef = null
    this.skipDelayTimerRef = null
    this.isOpenDelayed = true
    this.isMenuActive = false
    this.exitCallbacks = new Map()

    this.buildPairs()

    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    this.boundHandleFocusOut = this.handleFocusOut.bind(this)
    this.boundHandleLinkClick = this.handleLinkClick.bind(this)
    this.boundBeforeCache = () => this.closeAll()

    document.addEventListener('click', this.boundHandleClickOutside)
    document.addEventListener('turbo:before-cache', this.boundBeforeCache)
    this.element.addEventListener('keydown', this.boundHandleKeydown)
    this.element.addEventListener('focusout', this.boundHandleFocusOut)
    this.element.addEventListener('click', this.boundHandleLinkClick)

    this.escapeLayer = createEscapeLayer(() => this.handleEscape(), { element: this.element })

    this.initializeTriggers()
  }

  disconnect() {
    this.clearTimers()
    this.escapeLayer?.deactivate()
    this.closeAll()
    document.removeEventListener('click', this.boundHandleClickOutside)
    document.removeEventListener('turbo:before-cache', this.boundBeforeCache)
    this.element.removeEventListener('keydown', this.boundHandleKeydown)
    this.element.removeEventListener('focusout', this.boundHandleFocusOut)
    this.element.removeEventListener('click', this.boundHandleLinkClick)
  }

  // Trigger ↔ content pairs, by structure (each item holds a trigger and its
  // content). Built once, before any content moves into the viewport; a
  // content already linked by aria-controls (Turbo snapshot) is found by id.
  buildPairs() {
    this.pairs = this.triggerTargets.map(trigger => {
      const item = trigger.closest('[data-ui--navigation-menu-target="item"]') || trigger.parentElement
      const controlled = trigger.getAttribute('aria-controls')
      const content = (controlled && this.element.querySelector(`#${CSS.escape(controlled)}`)) ||
        item?.querySelector('[data-ui--navigation-menu-target="content"]') ||
        null
      return { trigger, content, item }
    })
  }

  initializeTriggers() {
    this.pairs.forEach(({ trigger, content, item }) => {
      // Every trigger is a Tab stop (drop the old roving tabindex)
      if (trigger.getAttribute('tabindex') === '-1' || trigger.getAttribute('tabindex') === '0') {
        trigger.removeAttribute('tabindex')
      }
      trigger.setAttribute('data-state', 'closed')
      trigger.setAttribute('aria-expanded', 'false')

      if (content) {
        ensureId(trigger, 'navigation-menu-trigger')
        ensureId(content, 'navigation-menu-content')
        setIdRefs(trigger, 'aria-controls', content)
        setIdRefs(content, 'aria-labelledby', trigger)
        content.setAttribute('data-state', 'closed')
        content.removeAttribute('data-motion')
        this.moveHome(content, item)
      }
    })
  }

  contentFor(index) {
    return this.pairs?.[index]?.content || null
  }

  clearTimers() {
    if (this.openTimerRef) {
      clearTimeout(this.openTimerRef)
      this.openTimerRef = null
    }
    if (this.closeTimerRef) {
      clearTimeout(this.closeTimerRef)
      this.closeTimerRef = null
    }
    if (this.skipDelayTimerRef) {
      clearTimeout(this.skipDelayTimerRef)
      this.skipDelayTimerRef = null
    }
  }

  // =========================================================================
  // OPEN/CLOSE LOGIC
  // =========================================================================

  toggle(event) {
    const trigger = event.currentTarget
    const triggerIndex = this.triggerTargets.indexOf(trigger)
    const content = this.contentFor(triggerIndex)

    if (!content) return

    // A click decides; a pending hover-open must not undo it
    if (this.openTimerRef) {
      clearTimeout(this.openTimerRef)
      this.openTimerRef = null
    }

    const isCurrentlyOpen = trigger.getAttribute('data-state') === 'open'

    if (isCurrentlyOpen) {
      this.closeMenu()
    } else {
      this.openMenu(triggerIndex)
    }
  }

  openMenu(index) {
    const trigger = this.triggerTargets[index]
    const content = this.contentFor(index)

    if (!trigger || !content) return

    // Calculate motion directions based on current state
    const enterMotion = this.calculateEnterMotion(index)
    const exitMotion = this.calculateExitMotion(index)

    // Close any currently open menu with exit animation
    this.pairs.forEach(({ trigger: t, content: c }, i) => {
      if (c && i !== index && t.getAttribute('data-state') === 'open') {
        this.animateContentOut(c, t, exitMotion)
      }
    })

    // A panel re-opened mid exit animation must not be hidden by it
    this.cancelExit(content)

    if (this.viewportValue && this.hasViewportTarget) {
      this.updateViewport(content)
    }

    // Open the new menu with enter animation
    content.setAttribute('data-motion', enterMotion)
    content.setAttribute('data-state', 'open')
    trigger.setAttribute('data-state', 'open')
    trigger.setAttribute('aria-expanded', 'true')

    // Update state
    this.previousIndexValue = this.activeIndexValue
    this.activeIndexValue = index
    this.isMenuActive = true
    this.escapeLayer?.activate()

    if (this.viewportValue && this.hasViewportTarget) {
      this.sizeViewport(content)
    }
  }

  /**
   * Animate content out with exit animation.
   * We wait for animationend before setting data-state="closed" because
   * that triggers invisible which would hide the element immediately.
   * fill-mode-forwards ensures no "flash" between animation end and invisible being applied.
   * When no animation runs (reduced motion, no CSS) it closes right away.
   */
  animateContentOut(content, trigger, motion) {
    // Set the exit motion to start animation
    content.setAttribute('data-motion', motion)

    // Update trigger state immediately
    trigger.setAttribute('data-state', 'closed')
    trigger.setAttribute('aria-expanded', 'false')

    this.whenExitDone(content, () => {
      content.setAttribute('data-state', 'closed')
      this.moveHome(content)
    })
  }

  whenExitDone(content, callback) {
    this.cancelExit(content)

    let frame = null
    let timer = null
    const finish = () => {
      if (this.exitCallbacks.get(content) !== entry) return
      this.cancelExit(content)
      callback()
    }
    const entry = {
      cancel: () => {
        content.removeEventListener('animationend', finish)
        if (frame) cancelAnimationFrame(frame)
        if (timer) clearTimeout(timer)
      }
    }
    this.exitCallbacks.set(content, entry)

    content.addEventListener('animationend', finish, { once: true })
    // No animation started (X10): don't wait for an animationend that never comes
    frame = requestAnimationFrame(() => {
      frame = null
      const running = typeof content.getAnimations === 'function' ? content.getAnimations() : []
      if (running.length === 0) finish()
    })
    timer = setTimeout(finish, EXIT_FALLBACK_MS)
  }

  cancelExit(content) {
    const entry = this.exitCallbacks?.get(content)
    if (entry) {
      entry.cancel()
      this.exitCallbacks.delete(content)
    }
  }

  closeMenu() {
    const index = this.activeIndexValue
    if (index < 0) return

    const trigger = this.triggerTargets[index]
    const content = this.contentFor(index)

    if (content && trigger) {
      // Just fade out when closing without moving to another menu (no slide)
      this.animateContentOut(content, trigger, 'to-none')
    }

    // Hide viewport
    if (this.viewportValue && this.hasViewportTarget) {
      this.viewportTarget.setAttribute('data-state', 'closed')
    }

    this.previousIndexValue = this.activeIndexValue
    this.activeIndexValue = -1
    this.isMenuActive = false
    this.escapeLayer?.deactivate()
  }

  closeAll() {
    this.pairs?.forEach(({ trigger, content }) => {
      if (content) {
        this.cancelExit(content)
        content.setAttribute('data-state', 'closed')
        this.moveHome(content)
      }
      trigger.setAttribute('data-state', 'closed')
      trigger.setAttribute('aria-expanded', 'false')
    })

    if (this.viewportValue && this.hasViewportTarget) {
      this.viewportTarget.setAttribute('data-state', 'closed')
    }

    this.activeIndexValue = -1
    this.isMenuActive = false
    this.escapeLayer?.deactivate()
  }

  // =========================================================================
  // HOVER HANDLERS
  // =========================================================================

  handleTriggerHover(event) {
    const trigger = event.currentTarget
    const triggerIndex = this.triggerTargets.indexOf(trigger)

    // Clear any pending close timer
    if (this.closeTimerRef) {
      clearTimeout(this.closeTimerRef)
      this.closeTimerRef = null
    }

    // If menu is already active (another item was open), open immediately
    if (this.isMenuActive && triggerIndex !== this.activeIndexValue) {
      this.openMenu(triggerIndex)
      return
    }

    // If this item is already open, do nothing
    if (triggerIndex === this.activeIndexValue) {
      return
    }

    // Apply delay for first hover
    if (this.isOpenDelayed) {
      this.openTimerRef = setTimeout(() => {
        this.openMenu(triggerIndex)
        this.isOpenDelayed = false

        // Start skip delay timer
        this.skipDelayTimerRef = setTimeout(() => {
          this.isOpenDelayed = true
        }, this.skipDelayDurationValue)
      }, this.delayDurationValue)
    } else {
      this.openMenu(triggerIndex)
    }
  }

  handleTriggerLeave(event) {
    const trigger = event.currentTarget
    const triggerIndex = this.triggerTargets.indexOf(trigger)
    const relatedTarget = event.relatedTarget

    // Clear open timer if leaving before it fires
    if (this.openTimerRef) {
      clearTimeout(this.openTimerRef)
      this.openTimerRef = null
    }

    // Check if we're moving to the content
    const content = this.contentFor(triggerIndex)
    if (content && content.contains(relatedTarget)) {
      return
    }

    // Check if we're moving to another trigger
    if (relatedTarget && this.triggerTargets.includes(relatedTarget)) {
      return
    }

    // Check if we're moving to the viewport
    if (this.hasViewportTarget && this.viewportTarget.contains(relatedTarget)) {
      return
    }

    // Start close timer
    this.closeTimerRef = setTimeout(() => {
      this.closeMenu()
    }, this.delayDurationValue)
  }

  handleContentLeave(event) {
    const content = event.currentTarget
    const contentIndex = this.pairs.findIndex(pair => pair.content === content)
    const relatedTarget = event.relatedTarget

    // Check if we're moving to the trigger
    const trigger = this.triggerTargets[contentIndex]
    if (trigger && trigger.contains(relatedTarget)) {
      return
    }

    // Check if we're moving to another trigger
    if (relatedTarget && this.triggerTargets.includes(relatedTarget)) {
      return
    }

    // Check if we're staying within viewport
    if (this.hasViewportTarget && this.viewportTarget.contains(relatedTarget)) {
      return
    }

    // Start close timer
    this.closeTimerRef = setTimeout(() => {
      this.closeMenu()
    }, this.delayDurationValue)
  }

  handleViewportEnter() {
    // Cancel close timer when entering viewport
    if (this.closeTimerRef) {
      clearTimeout(this.closeTimerRef)
      this.closeTimerRef = null
    }
  }

  handleViewportLeave(event) {
    const relatedTarget = event.relatedTarget

    // Check if we're moving back to a trigger
    if (relatedTarget && this.triggerTargets.includes(relatedTarget)) {
      return
    }

    // Start close timer
    this.closeTimerRef = setTimeout(() => {
      this.closeMenu()
    }, this.delayDurationValue)
  }

  // =========================================================================
  // MOTION CALCULATION
  // =========================================================================

  /**
   * Calculate the enter motion for the new menu.
   * - First menu opening: just fade in (no slide)
   * - Moving right: enter from right
   * - Moving left: enter from left
   */
  calculateEnterMotion(newIndex) {
    // First menu opening - no direction, just fade
    if (this.activeIndexValue === -1) {
      return 'from-none'
    }

    // Moving right (higher index) - enter from right
    if (newIndex > this.activeIndexValue) {
      return 'from-end'
    }

    // Moving left (lower index) - enter from left
    return 'from-start'
  }

  /**
   * Calculate the exit motion for the current menu.
   * - Moving right: exit to left
   * - Moving left: exit to right
   */
  calculateExitMotion(newIndex) {
    // Moving right - exit to left
    if (newIndex > this.activeIndexValue) {
      return 'to-start'
    }

    // Moving left - exit to right
    return 'to-end'
  }

  // =========================================================================
  // VIEWPORT
  // =========================================================================

  // Move the real content node into the viewport (no clone: one copy of
  // every link and id, and focus lands on what the user sees).
  updateViewport(content) {
    if (!this.hasViewportTarget) return
    if (content.parentElement !== this.viewportTarget) {
      this.viewportTarget.appendChild(content)
    }
    this.viewportTarget.setAttribute('data-state', 'open')
  }

  sizeViewport(content) {
    const viewport = this.viewportTarget
    const width = content.offsetWidth || content.getBoundingClientRect().width
    const height = content.offsetHeight || content.getBoundingClientRect().height
    viewport.style.setProperty('--ui-navigation-menu-viewport-width', `${width}px`)
    viewport.style.setProperty('--ui-navigation-menu-viewport-height', `${height}px`)
  }

  // Put a content back inside its item (after closing in viewport mode)
  moveHome(content, item = null) {
    const home = item || this.pairs?.find(pair => pair.content === content)?.item
    if (home && content.parentElement !== home) {
      home.appendChild(content)
    }
  }

  // =========================================================================
  // KEYBOARD NAVIGATION
  // =========================================================================

  // Top-level Tab stops in list order: triggers and plain links
  topLevelElements() {
    const items = this.hasItemTarget ? this.itemTargets : this.pairs.map(pair => pair.item).filter(Boolean)
    return items.map(item => {
      const trigger = this.triggerTargets.find(t => item.contains(t))
      if (trigger) return trigger
      return Array.from(item.querySelectorAll('a[href], button')).find(el => !el.closest('[data-ui--navigation-menu-target="content"]'))
    }).filter(Boolean)
  }

  handleKeydown(event) {
    const active = document.activeElement
    const triggerIndex = this.triggerTargets.indexOf(active)
    const topLevel = this.topLevelElements()

    if (triggerIndex === -1 && !topLevel.includes(active)) {
      if (this.isMenuActive) this.handleContentKeydown(event)
      return
    }

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        this.focusTopLevel(topLevel, topLevel.indexOf(active) + 1)
        break

      case 'ArrowLeft':
        event.preventDefault()
        this.focusTopLevel(topLevel, topLevel.indexOf(active) - 1)
        break

      case 'Home':
        event.preventDefault()
        this.focusTopLevel(topLevel, 0)
        break

      case 'End':
        event.preventDefault()
        this.focusTopLevel(topLevel, topLevel.length - 1)
        break

      case 'ArrowDown':
        if (triggerIndex === -1) return
        event.preventDefault()
        if (this.activeIndexValue !== triggerIndex) this.openMenu(triggerIndex)
        this.focusFirstContentLink()
        break

      case 'Tab':
        // Viewport mode: the open content isn't next in DOM order, so Tab
        // from its trigger moves into it (Radix focus proxy)
        if (!event.shiftKey && triggerIndex !== -1 && triggerIndex === this.activeIndexValue && this.viewportValue && this.hasViewportTarget) {
          const first = this.contentTabbables(this.contentFor(triggerIndex))[0]
          if (first) {
            event.preventDefault()
            first.focus()
          }
        }
        break
    }
  }

  handleContentKeydown(event) {
    const index = this.activeIndexValue
    const content = this.contentFor(index)
    if (!content || !content.contains(document.activeElement)) return

    const tabbables = this.contentTabbables(content)
    const position = tabbables.indexOf(document.activeElement)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        tabbables[Math.min(position + 1, tabbables.length - 1)]?.focus()
        break

      case 'ArrowUp':
        event.preventDefault()
        tabbables[Math.max(position - 1, 0)]?.focus()
        break

      case 'Home':
        event.preventDefault()
        tabbables[0]?.focus()
        break

      case 'End':
        event.preventDefault()
        tabbables[tabbables.length - 1]?.focus()
        break

      case 'Tab': {
        // Non-viewport mode: the content follows its trigger in DOM order,
        // native Tab is right and focusout closes the menu.
        if (!this.viewportValue || !this.hasViewportTarget) break

        const trigger = this.triggerTargets[index]
        if (event.shiftKey && position === 0) {
          event.preventDefault()
          trigger.focus()
        } else if (!event.shiftKey && position === tabbables.length - 1) {
          // Leave to whatever follows the trigger, not to trigger 0
          event.preventDefault()
          const next = this.tabbableAfter(trigger)
          this.closeMenu()
          ;(next || trigger).focus()
        }
        break
      }
    }
  }

  handleEscape() {
    const index = this.activeIndexValue
    const hadFocus = this.element.contains(document.activeElement)
    this.closeMenu()
    if (hadFocus && index >= 0) this.triggerTargets[index]?.focus()
  }

  contentTabbables(content) {
    if (!content) return []
    return Array.from(content.querySelectorAll(CONTENT_TABBABLE))
  }

  // Next Tab stop after the trigger in the page, skipping the open content
  tabbableAfter(trigger) {
    const skip = this.hasViewportTarget ? this.viewportTarget : null
    const list = getTabbableElements(document.body).filter(el => !(skip && skip.contains(el)))
    const position = list.indexOf(trigger)
    return position === -1 ? null : list[position + 1] || null
  }

  focusTopLevel(list, index) {
    if (list.length === 0) return
    const wrapped = (index + list.length) % list.length
    list[wrapped]?.focus()
  }

  focusNextTrigger(currentIndex) {
    const nextIndex = (currentIndex + 1) % this.triggerTargets.length
    this.focusTrigger(nextIndex)
  }

  focusPreviousTrigger(currentIndex) {
    const prevIndex = currentIndex === 0 ? this.triggerTargets.length - 1 : currentIndex - 1
    this.focusTrigger(prevIndex)
  }

  focusTrigger(index) {
    this.triggerTargets[index]?.focus()
  }

  focusFirstContentLink(framesLeft = 5) {
    const content = this.contentFor(this.activeIndexValue)
    if (!content) return

    const firstLink = this.contentTabbables(content)[0]
    if (!firstLink) return
    firstLink.focus()
    // The panel may still compute as hidden on the frame it opens
    if (document.activeElement !== firstLink && framesLeft > 0) {
      requestAnimationFrame(() => this.focusFirstContentLink(framesLeft - 1))
    }
  }

  // =========================================================================
  // FOCUS OUT, LINK SELECT, CLICK OUTSIDE
  // =========================================================================

  // Close when focus leaves the open item (its trigger and its content)
  handleFocusOut(event) {
    if (!this.isMenuActive) return
    const next = event.relatedTarget
    if (!next) return

    const index = this.activeIndexValue
    const trigger = this.triggerTargets[index]
    const content = this.contentFor(index)
    if (trigger?.contains(next) || content?.contains(next)) return

    this.closeMenu()
  }

  // Following a link inside a panel closes the menu (Radix onSelect)
  handleLinkClick(event) {
    const link = event.target.closest?.('a[href]')
    if (!link || !this.isMenuActive) return
    const content = this.contentFor(this.activeIndexValue)
    if (content?.contains(link)) this.closeMenu()
  }

  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.closeAll()
    }
  }
}
