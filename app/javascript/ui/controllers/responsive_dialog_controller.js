import { Controller } from "@hotwired/stimulus"
import { focusFirstElement } from "../utils/focus-trap-manager.js"

// ResponsiveDialog controller
// Manages switching between Dialog (desktop) and Drawer (mobile) at breakpoint
//
// Hybrid approach:
// - CSS handles initial rendering (md:hidden / md:block)
// - JavaScript provides progressive enhancement (state sync, smooth transitions)
export default class extends Controller {
  static targets = ["drawer", "dialog"]
  static values = {
    breakpoint: { type: Number, default: 768 }, // md breakpoint in pixels
    open: { type: Boolean, default: false }
  }

  connect() {
    // Setup media query for responsive switching
    this.mediaQuery = window.matchMedia(`(min-width: ${this.breakpointValue}px)`)

    // Bind handler to maintain correct context
    this.handleBreakpointChangeHandler = this.handleBreakpointChange.bind(this)

    // Listen for breakpoint changes
    this.mediaQuery.addEventListener("change", this.handleBreakpointChangeHandler)

    // Initial sync
    this.syncState()
  }

  disconnect() {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener("change", this.handleBreakpointChangeHandler)
    }
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  open() {
    this.openValue = true
    this.syncState()
  }

  close() {
    this.openValue = false
    this.syncState()
  }

  toggle() {
    this.openValue = !this.openValue
    this.syncState()
  }

  // ============================================================================
  // BREAKPOINT HANDLING
  // ============================================================================

  handleBreakpointChange(event) {
    // When switching between mobile/desktop, sync state
    this.syncState()

    // Handle focus transfer if component is open
    if (this.openValue) {
      this.transferFocus()
    }

    // Dispatch resize event
    this.element.dispatchEvent(new CustomEvent("responsive-dialog:resize", {
      bubbles: true,
      detail: {
        isDesktop: event.matches,
        breakpoint: this.breakpointValue
      }
    }))
  }

  syncState() {
    const isDesktop = this.mediaQuery.matches

    // Determine which component is active
    const activeComponent = isDesktop ? "dialog" : "drawer"
    const inactiveComponent = isDesktop ? "drawer" : "dialog"

    // Sync open state to active component
    if (this.openValue) {
      this.openComponent(activeComponent)
      this.ensureClosedComponent(inactiveComponent)
    } else {
      this.ensureClosedComponent("drawer")
      this.ensureClosedComponent("dialog")
    }
  }

  openComponent(componentType) {
    const target = componentType === "dialog" ? this.dialogTarget : this.drawerTarget

    if (!target) return

    // Dispatch open event to component's Stimulus controller
    const openEvent = new CustomEvent(`${componentType}:open`, {
      bubbles: true,
      detail: { open: true }
    })

    target.dispatchEvent(openEvent)
  }

  ensureClosedComponent(componentType) {
    const target = componentType === "dialog" ? this.dialogTarget : this.drawerTarget

    if (!target) return

    // Dispatch close event to component's Stimulus controller
    const closeEvent = new CustomEvent(`${componentType}:close`, {
      bubbles: true,
      detail: { open: false }
    })

    target.dispatchEvent(closeEvent)
  }

  // ============================================================================
  // FOCUS MANAGEMENT
  // ============================================================================

  transferFocus() {
    // When switching between dialog/drawer while open, transfer focus
    const isDesktop = this.mediaQuery.matches
    const targetEl = isDesktop ? this.dialogTarget : this.drawerTarget

    if (!targetEl) return

    // Use focus trap utility with delay for component transition
    setTimeout(() => {
      focusFirstElement(targetEl)
    }, 100)
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  get isDesktop() {
    return this.mediaQuery.matches
  }

  get isMobile() {
    return !this.mediaQuery.matches
  }

  get activeComponentType() {
    return this.isDesktop ? "dialog" : "drawer"
  }
}
