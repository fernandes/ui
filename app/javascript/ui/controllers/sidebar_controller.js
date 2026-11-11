import { Controller } from "@hotwired/stimulus"
import { setIdRefs } from "../utils/id-manager.js"

// Sidebar controller for collapsible navigation sidebars
// Based on shadcn/ui Sidebar component
//
// Features:
// - Desktop: collapsible sidebar (offcanvas, icon, or none modes)
// - Mobile: modal sheet (ui--dialog). The content is rendered once, in the
//   desktop <aside>, and moved into the sheet below the breakpoint
// - Trigger exposes aria-expanded / aria-controls; a collapsed offcanvas
//   sidebar is inert so its links leave the Tab order
// - Cookie persistence for state
// - Keyboard shortcut (Cmd/Ctrl + B)
// - Responsive detection (< 768px = mobile)
export default class extends Controller {
  static targets = ["sidebar", "trigger", "mobileSheet", "mobileDrawer", "content", "mobileContent"]
  static values = {
    open: { type: Boolean, default: true },
    openMobile: { type: Boolean, default: false },
    collapsible: { type: String, default: "icon" }, // "offcanvas" | "icon" | "none"
    side: { type: String, default: "left" },
    cookieName: { type: String, default: "sidebar_state" },
    cookieExpires: { type: Number, default: 7 } // days
  }

  // Mobile breakpoint (md in Tailwind)
  MOBILE_BREAKPOINT = 768

  connect() {
    // Load state from cookie
    this.loadCookie()

    // Setup keyboard shortcut (Cmd/Ctrl + B)
    this.boundHandleKeyboard = this.handleKeyboard.bind(this)
    document.addEventListener("keydown", this.boundHandleKeyboard)

    // Setup resize handler
    this.boundHandleResize = this.handleResize.bind(this)
    window.addEventListener("resize", this.boundHandleResize)

    // Listen for dialog:close events from mobile sheet to sync state
    this.boundHandleSheetClose = this.handleSheetClose.bind(this)
    this.element.addEventListener("dialog:close", this.boundHandleSheetClose)

    // Put the content where it is shown, then sync state
    this.placeContent()
    this.updateState()
  }

  disconnect() {
    document.removeEventListener("keydown", this.boundHandleKeyboard)
    window.removeEventListener("resize", this.boundHandleResize)
    this.element.removeEventListener("dialog:close", this.boundHandleSheetClose)
  }

  // ============================================================================
  // PUBLIC ACTIONS
  // ============================================================================

  toggle() {
    if (this.isMobile()) {
      this.toggleMobile()
    } else {
      this.toggleDesktop()
    }
  }

  open() {
    if (this.isMobile()) {
      this.openMobile()
    } else {
      this.openDesktop()
    }
  }

  close() {
    if (this.isMobile()) {
      this.closeMobile()
    } else {
      this.closeDesktop()
    }
  }

  setOpen(open) {
    if (this.isMobile()) {
      this.openMobileValue = open
    } else {
      this.openValue = open
      this.saveCookie()
    }
    this.updateState()
  }

  // ============================================================================
  // DESKTOP STATE MANAGEMENT
  // ============================================================================

  toggleDesktop() {
    this.openValue = !this.openValue
    this.saveCookie()
    this.updateState()
    this.dispatchToggleEvent()
  }

  openDesktop() {
    this.openValue = true
    this.saveCookie()
    this.updateState()
    this.dispatchToggleEvent()
  }

  closeDesktop() {
    this.openValue = false
    this.saveCookie()
    this.updateState()
    this.dispatchToggleEvent()
  }

  // ============================================================================
  // MOBILE STATE MANAGEMENT
  // ============================================================================

  toggleMobile() {
    this.openMobileValue = !this.openMobileValue
    this.updateMobileDrawer()
  }

  openMobile() {
    this.openMobileValue = true
    this.updateMobileDrawer()
  }

  closeMobile() {
    this.openMobileValue = false
    this.updateMobileDrawer()
  }

  // Called directly and again from openMobileValueChanged, so it only acts
  // when the sheet isn't already in the wanted state
  updateMobileDrawer() {
    this.syncTriggers()

    // If we have a mobile sheet target (uses ui--dialog controller like shadcn)
    if (this.hasMobileSheetTarget) {
      const sheetController = this.application.getControllerForElementAndIdentifier(
        this.mobileSheetTarget,
        "ui--dialog"
      )
      if (sheetController && sheetController.openValue !== this.openMobileValue) {
        if (this.openMobileValue) {
          sheetController.open()
        } else {
          sheetController.close()
        }
      }
      return
    }

    // Fallback: If we have a mobile drawer target (uses ui--drawer controller)
    if (this.hasMobileDrawerTarget) {
      const drawerController = this.application.getControllerForElementAndIdentifier(
        this.mobileDrawerTarget,
        "ui--drawer"
      )
      if (drawerController) {
        if (this.openMobileValue) {
          drawerController.open()
        } else {
          drawerController.close()
        }
      }
    }
  }

  // ============================================================================
  // STATE HELPERS
  // ============================================================================

  getState() {
    if (this.collapsibleValue === "none") {
      return "expanded"
    }
    return this.openValue ? "expanded" : "collapsed"
  }

  isMobile() {
    return window.innerWidth < this.MOBILE_BREAKPOINT
  }

  updateState() {
    const state = this.getState()

    // Only set collapsible attribute when collapsed (matches shadcn behavior)
    // This allows CSS selectors like group-has-[[data-collapsible=icon]] to work correctly
    const collapsibleAttr = state === "collapsed" ? this.collapsibleValue : ""

    // Update element data attributes
    this.element.dataset.state = state
    this.element.dataset.collapsible = collapsibleAttr
    this.element.dataset.side = this.sideValue

    // Update sidebar target if exists
    if (this.hasSidebarTarget) {
      this.sidebarTarget.dataset.state = state
      this.sidebarTarget.dataset.collapsible = collapsibleAttr
      this.sidebarTarget.dataset.side = this.sideValue
    }

    // A collapsed offcanvas sidebar is off screen: keep its links out of
    // the Tab order and the accessibility tree
    if (this.hasSidebarTarget) {
      this.sidebarTarget.inert = !this.isMobile() && state === "collapsed" && this.collapsibleValue === "offcanvas"
    }

    // Update trigger targets
    this.triggerTargets.forEach(trigger => {
      trigger.dataset.state = state
    })
    this.syncTriggers()
  }

  // aria-expanded / aria-controls follow what the trigger toggles right now:
  // the mobile sheet on phones, the sidebar otherwise
  syncTriggers() {
    const mobile = this.isMobile() && this.hasMobileContentTarget
    const controlled = mobile ? this.mobileContentTarget : (this.hasSidebarTarget ? this.sidebarTarget : null)
    const expanded = mobile ? this.openMobileValue : this.getState() === "expanded"

    this.triggerTargets.forEach(trigger => {
      trigger.setAttribute("aria-expanded", String(expanded))
      if (controlled) setIdRefs(trigger, "aria-controls", controlled, { prefix: "sidebar" })
    })
  }

  // The content is rendered once, in the <aside>. Below the breakpoint it
  // moves into the mobile sheet, and back above it.
  placeContent() {
    if (!this.hasContentTarget) return

    const mobile = this.isMobile() && this.hasMobileContentTarget
    const host = mobile ? this.mobileContentTarget : (this.hasSidebarTarget ? this.sidebarTarget : null)
    if (!host || this.contentTarget.parentElement === host) return

    // Leaving the phone layout with the sheet open: close it first
    if (!mobile && this.openMobileValue) this.closeMobile()
    host.append(this.contentTarget)
  }

  // ============================================================================
  // COOKIE PERSISTENCE
  // ============================================================================

  saveCookie() {
    const expires = new Date()
    expires.setDate(expires.getDate() + this.cookieExpiresValue)

    document.cookie = `${this.cookieNameValue}=${this.openValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
  }

  loadCookie() {
    const cookies = document.cookie.split("; ")
    const cookie = cookies.find(c => c.startsWith(`${this.cookieNameValue}=`))

    if (cookie) {
      const value = cookie.split("=")[1]
      this.openValue = value === "true"
    }
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  handleKeyboard(event) {
    // Cmd/Ctrl + B to toggle sidebar
    if ((event.metaKey || event.ctrlKey) && event.key === "b") {
      event.preventDefault()
      this.toggle()
    }
  }

  handleResize() {
    // Update state on resize (e.g., when crossing mobile breakpoint)
    this.placeContent()
    this.updateState()
  }

  handleSheetClose(event) {
    // When the mobile sheet closes (via overlay click, escape, etc.), sync the sidebar state
    // Check if the event came from our mobile sheet target
    if (this.hasMobileSheetTarget && this.mobileSheetTarget.contains(event.target)) {
      this.openMobileValue = false
      this.syncTriggers()

      // The sheet restores focus to what opened it; when that was <body>
      // (Safari doesn't focus buttons on click) fall back to the trigger
      const active = document.activeElement
      if (!active || active === document.body) {
        this.triggerTargets.find(trigger => !this.mobileSheetTarget.contains(trigger))?.focus()
      }
    }
  }

  dispatchToggleEvent() {
    this.element.dispatchEvent(new CustomEvent("sidebar:toggle", {
      bubbles: true,
      detail: {
        open: this.openValue,
        state: this.getState(),
        collapsible: this.collapsibleValue,
        side: this.sideValue
      }
    }))
  }

  // ============================================================================
  // VALUE CHANGED CALLBACKS
  // ============================================================================

  openValueChanged() {
    this.updateState()
  }

  openMobileValueChanged() {
    this.updateMobileDrawer()
  }

  collapsibleValueChanged() {
    this.updateState()
  }

  sideValueChanged() {
    this.updateState()
  }
}
