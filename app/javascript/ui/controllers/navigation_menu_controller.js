import { Controller } from "@hotwired/stimulus"

/**
 * NavigationMenu Controller
 *
 * Implements the navigation menu pattern with hover/focus activation
 * and keyboard navigation.
 *
 * Based on Radix UI NavigationMenu:
 * https://www.radix-ui.com/primitives/docs/components/navigation-menu
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

    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    this.boundHandleKeydown = this.handleKeydown.bind(this)

    document.addEventListener('click', this.boundHandleClickOutside)
    document.addEventListener('keydown', this.boundHandleKeydown)

    // Initialize triggers with proper tabindex
    this.initializeTriggers()
  }

  disconnect() {
    this.clearTimers()
    document.removeEventListener('click', this.boundHandleClickOutside)
    document.removeEventListener('keydown', this.boundHandleKeydown)
  }

  initializeTriggers() {
    this.triggerTargets.forEach((trigger, index) => {
      trigger.setAttribute('tabindex', index === 0 ? '0' : '-1')
    })
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
    const content = this.contentTargets[triggerIndex]

    if (!content) return

    const isCurrentlyOpen = trigger.getAttribute('data-state') === 'open'

    if (isCurrentlyOpen) {
      this.closeMenu()
    } else {
      this.openMenu(triggerIndex)
    }
  }

  openMenu(index) {
    const trigger = this.triggerTargets[index]
    const content = this.contentTargets[index]

    if (!trigger || !content) return

    // Calculate motion directions based on current state
    const enterMotion = this.calculateEnterMotion(index)
    const exitMotion = this.calculateExitMotion(index)

    // Close any currently open menu with exit animation
    this.triggerTargets.forEach((t, i) => {
      const c = this.contentTargets[i]
      if (c && i !== index && t.getAttribute('data-state') === 'open') {
        // Start exit animation - keep data-state="open" so element stays visible
        this.animateContentOut(c, t, exitMotion)
      }
    })

    // Open the new menu with enter animation
    content.setAttribute('data-motion', enterMotion)
    content.setAttribute('data-state', 'open')
    trigger.setAttribute('data-state', 'open')
    trigger.setAttribute('aria-expanded', 'true')

    // Update state
    this.previousIndexValue = this.activeIndexValue
    this.activeIndexValue = index
    this.isMenuActive = true

    // Update viewport if enabled
    if (this.viewportValue && this.hasViewportTarget) {
      this.updateViewport(content)
    }
  }

  /**
   * Animate content out with exit animation.
   * We wait for animationend before setting data-state="closed" because
   * that triggers invisible which would hide the element immediately.
   * fill-mode-forwards ensures no "flash" between animation end and invisible being applied.
   */
  animateContentOut(content, trigger, motion) {
    // Set the exit motion to start animation
    content.setAttribute('data-motion', motion)

    // Update trigger state immediately
    trigger.setAttribute('data-state', 'closed')
    trigger.setAttribute('aria-expanded', 'false')

    // Wait for animation to complete before hiding
    content.addEventListener('animationend', () => {
      content.setAttribute('data-state', 'closed')
    }, { once: true })
  }

  closeMenu() {
    const index = this.activeIndexValue
    if (index < 0) return

    const trigger = this.triggerTargets[index]
    const content = this.contentTargets[index]

    if (content && trigger) {
      // Just fade out when closing without moving to another menu (no slide)
      const motion = 'to-none'
      this.animateContentOut(content, trigger, motion)
    }

    // Hide viewport
    if (this.viewportValue && this.hasViewportTarget) {
      this.viewportTarget.setAttribute('data-state', 'closed')
    }

    this.previousIndexValue = this.activeIndexValue
    this.activeIndexValue = -1
    this.isMenuActive = false
  }

  closeAll() {
    this.triggerTargets.forEach((trigger, index) => {
      const content = this.contentTargets[index]
      if (content) {
        content.setAttribute('data-state', 'closed')
      }
      trigger.setAttribute('data-state', 'closed')
      trigger.setAttribute('aria-expanded', 'false')
    })

    if (this.viewportValue && this.hasViewportTarget) {
      this.viewportTarget.setAttribute('data-state', 'closed')
    }

    this.activeIndexValue = -1
    this.isMenuActive = false
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
    const content = this.contentTargets[triggerIndex]
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
    const contentIndex = this.contentTargets.indexOf(content)
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

  updateViewport(content) {
    if (!this.hasViewportTarget) return

    // Clone content into viewport for display
    const viewport = this.viewportTarget

    // Clear previous content
    viewport.innerHTML = ''

    // Clone and append new content
    const clonedContent = content.cloneNode(true)
    clonedContent.style.position = 'relative'
    clonedContent.style.left = 'auto'
    clonedContent.style.top = 'auto'
    viewport.appendChild(clonedContent)

    // Get content dimensions
    const contentRect = clonedContent.getBoundingClientRect()

    // Set CSS variables for viewport sizing
    viewport.style.setProperty('--ui-navigation-menu-viewport-width', `${contentRect.width}px`)
    viewport.style.setProperty('--ui-navigation-menu-viewport-height', `${contentRect.height}px`)

    // Open viewport
    viewport.setAttribute('data-state', 'open')
  }

  // =========================================================================
  // KEYBOARD NAVIGATION
  // =========================================================================

  handleKeydown(event) {
    // Only handle when focus is within this component
    if (!this.element.contains(document.activeElement)) return

    const trigger = this.triggerTargets.find(t => t === document.activeElement)
    if (!trigger) {
      // Check if we're in content
      if (this.isMenuActive) {
        this.handleContentKeydown(event)
      }
      return
    }

    const triggerIndex = this.triggerTargets.indexOf(trigger)

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        this.focusNextTrigger(triggerIndex)
        break

      case 'ArrowLeft':
        event.preventDefault()
        this.focusPreviousTrigger(triggerIndex)
        break

      case 'ArrowDown':
        event.preventDefault()
        if (this.activeIndexValue === triggerIndex) {
          // Focus first link in content
          this.focusFirstContentLink()
        } else {
          this.openMenu(triggerIndex)
          // Focus first link after opening
          setTimeout(() => this.focusFirstContentLink(), 50)
        }
        break

      case 'Enter':
      case ' ':
        event.preventDefault()
        if (this.activeIndexValue === triggerIndex) {
          this.closeMenu()
        } else {
          this.openMenu(triggerIndex)
        }
        break

      case 'Escape':
        event.preventDefault()
        if (this.isMenuActive) {
          this.closeMenu()
          // Return focus to trigger
          const activeTrigger = this.triggerTargets[this.previousIndexValue >= 0 ? this.previousIndexValue : 0]
          if (activeTrigger) activeTrigger.focus()
        }
        break

      case 'Home':
        event.preventDefault()
        this.focusTrigger(0)
        break

      case 'End':
        event.preventDefault()
        this.focusTrigger(this.triggerTargets.length - 1)
        break

      case 'Tab':
        // Let default tab behavior work, but close menu when tabbing out
        if (!event.shiftKey && this.isMenuActive) {
          // Will tab into content
        } else if (event.shiftKey && this.isMenuActive) {
          this.closeMenu()
        }
        break
    }
  }

  handleContentKeydown(event) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        this.closeMenu()
        // Return focus to trigger
        const activeTrigger = this.triggerTargets[this.previousIndexValue >= 0 ? this.previousIndexValue : this.activeIndexValue]
        if (activeTrigger) activeTrigger.focus()
        break

      case 'Tab':
        // Check if we're about to tab out of content
        const content = this.contentTargets[this.activeIndexValue]
        if (content) {
          const focusableElements = content.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')
          const lastFocusable = focusableElements[focusableElements.length - 1]

          if (!event.shiftKey && document.activeElement === lastFocusable) {
            // Tabbing forward from last element - close and move to next trigger
            event.preventDefault()
            this.closeMenu()
            this.focusNextTrigger(this.activeIndexValue)
          } else if (event.shiftKey && document.activeElement === focusableElements[0]) {
            // Tabbing backward from first element - close and focus trigger
            event.preventDefault()
            this.closeMenu()
            this.focusTrigger(this.activeIndexValue >= 0 ? this.activeIndexValue : 0)
          }
        }
        break
    }
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
    this.triggerTargets.forEach((t, i) => {
      t.setAttribute('tabindex', i === index ? '0' : '-1')
    })
    this.triggerTargets[index]?.focus()
  }

  focusFirstContentLink() {
    const content = this.contentTargets[this.activeIndexValue]
    if (!content) return

    const firstLink = content.querySelector('a, button, [tabindex]:not([tabindex="-1"])')
    if (firstLink) firstLink.focus()
  }

  // =========================================================================
  // CLICK OUTSIDE
  // =========================================================================

  handleClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.closeAll()
    }
  }
}
