import { Controller } from "@hotwired/stimulus"
import { setIdRefs } from "../utils/id-manager.js"

// ResponsiveDialog controller
// A Drawer below the breakpoint, a Dialog above it (shadcn "Responsive Dialog").
//
// - The caller's body is rendered ONCE (no duplicated ids) and moved into the
//   content of whichever variant is active.
// - Open/close state is real: open()/close() drive the child Dialog/Drawer
//   controllers, and the children's dialog:open/close and drawer:open/close
//   events keep this controller in sync when the user opens or closes them.
// - Crossing the breakpoint while open closes the variant that is now hidden
//   (releasing its inert background, scroll lock and Escape layer) and opens
//   the visible one, which takes focus.
// - The active content is named/described by the body's title/description.
export default class extends Controller {
  static targets = ["drawer", "dialog", "body", "drawerSlot", "dialogSlot", "title", "description"]
  static values = {
    breakpoint: { type: Number, default: 768 }, // md breakpoint in pixels
    open: { type: Boolean, default: false }
  }

  constructor() {
    super(...arguments)
  }

  connect() {
    this.mediaQuery = window.matchMedia(`(min-width: ${this.breakpointValue}px)`)
    this.handleBreakpointChange = this.handleBreakpointChange.bind(this)
    this.mediaQuery.addEventListener("change", this.handleBreakpointChange)

    this.onChildToggle = this.onChildToggle.bind(this)
    for (const type of ["dialog:open", "dialog:close", "drawer:open", "drawer:close"]) {
      this.element.addEventListener(type, this.onChildToggle)
    }

    this.active = this.activeComponentType
    this.placeBody()

    // The server renders both children closed; open only the visible one
    if (this.openValue) this.openChild(this.active)
  }

  disconnect() {
    this.mediaQuery?.removeEventListener("change", this.handleBreakpointChange)
    for (const type of ["dialog:open", "dialog:close", "drawer:open", "drawer:close"]) {
      this.element.removeEventListener(type, this.onChildToggle)
    }
  }

  // ============================================================================
  // ACTIONS
  // ============================================================================

  open() {
    this.openValue = true
    this.openChild(this.active)
  }

  close() {
    this.openValue = false
    this.closeChild(this.active)
  }

  toggle() {
    this.openValue ? this.close() : this.open()
  }

  // ============================================================================
  // STATE SYNC
  // ============================================================================

  // A child opened or closed itself (its trigger, close button, Escape,
  // overlay click, drag). Only the active variant speaks for the state: the
  // hidden one finishing its close animation after a handover doesn't count.
  onChildToggle(event) {
    const [type, action] = event.type.split(":")
    if (type !== this.active) return
    if (event.target !== this.childElement(type)) return

    this.openValue = action === "open"
  }

  handleBreakpointChange(event) {
    const next = this.activeComponentType
    if (next === this.active) return

    const previous = this.active
    this.active = next
    this.placeBody()

    if (this.openValue) {
      this.closeChild(previous)
      // Closing gave focus back to the hidden variant's trigger: drop it, so
      // the visible variant returns focus to its own trigger when it closes
      const hiddenWrapper = previous === "dialog" ? this.dialogTarget : this.drawerTarget
      if (hiddenWrapper.contains(document.activeElement)) document.activeElement.blur()
      this.openChild(next)
    }

    this.element.dispatchEvent(new CustomEvent("responsive-dialog:resize", {
      bubbles: true,
      detail: { isDesktop: this.isDesktop, breakpoint: this.breakpointValue }
    }))
  }

  openChild(type) {
    const controller = this.childController(type)
    if (controller) {
      if (!this.childIsOpen(type)) controller.open()
    } else {
      // Child not connected yet: it opens itself on connect
      this.childElement(type)?.setAttribute(`data-ui--${type}-open-value`, "true")
    }
  }

  closeChild(type) {
    const controller = this.childController(type)
    if (controller) {
      if (!this.childIsOpen(type)) return
      // Drawer's close() honours dismissible: false, but a handover or an
      // explicit close of the responsive dialog must still close it
      type === "drawer" ? controller.hide() : controller.close()
    } else {
      this.childElement(type)?.setAttribute(`data-ui--${type}-open-value`, "false")
    }
  }

  childIsOpen(type) {
    return this.childElement(type)?.getAttribute(`data-ui--${type}-open-value`) === "true"
  }

  // ============================================================================
  // BODY PLACEMENT + ARIA
  // ============================================================================

  placeBody() {
    if (!this.hasBodyTarget) return
    const slot = this.active === "dialog"
      ? (this.hasDialogSlotTarget ? this.dialogSlotTarget : null)
      : (this.hasDrawerSlotTarget ? this.drawerSlotTarget : null)
    if (!slot) return

    if (this.bodyTarget.parentElement !== slot) slot.appendChild(this.bodyTarget)
    this.wireAria()
  }

  wireAria() {
    const content = this.childElement(this.active)?.querySelector("[role='dialog']")
    if (!content) return

    const title = this.findTitle()
    const description = this.findDescription()
    if (title) setIdRefs(content, "aria-labelledby", title, { prefix: "responsive-dialog-title", overwrite: true })
    if (description) setIdRefs(content, "aria-describedby", description, { prefix: "responsive-dialog-description", overwrite: true })
  }

  findTitle() {
    if (this.hasTitleTarget) return this.titleTarget
    return this.bodyTarget.querySelector(
      "[data-ui--dialog-target='title'], [data-ui--drawer-target='title'], h1, h2, h3, h4, h5, h6, [role='heading']"
    )
  }

  findDescription() {
    if (this.hasDescriptionTarget) return this.descriptionTarget
    return this.bodyTarget.querySelector("[data-ui--dialog-target='description'], [data-ui--drawer-target='description']")
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  childElement(type) {
    const wrapper = type === "dialog"
      ? (this.hasDialogTarget ? this.dialogTarget : null)
      : (this.hasDrawerTarget ? this.drawerTarget : null)
    return wrapper?.querySelector(`[data-controller~='ui--${type}']`) || null
  }

  childController(type) {
    const element = this.childElement(type)
    return element ? this.application.getControllerForElementAndIdentifier(element, `ui--${type}`) : null
  }

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
