import { Controller } from "@hotwired/stimulus"
import { setState } from "../utils/state-manager.js"
import { ensureId, setIdRefs } from "../utils/id-manager.js"

// Tabs controller for tabbed interface with keyboard navigation
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    defaultValue: { type: String, default: "" },
    orientation: { type: String, default: "horizontal" },
    activationMode: { type: String, default: "automatic" }
  }

  connect() {
    this.wireIds()
    this.setupTabs()
  }

  // Per-instance ids (X1): each tab controls its panel, each panel is
  // labelled by its tab. Ids the author rendered are kept.
  wireIds() {
    this.triggerTargets.forEach((trigger) => {
      const content = this.contentTargets.find((c) => c.dataset.value === trigger.dataset.value)
      if (!content) return

      ensureId(trigger, "tabs-trigger")
      ensureId(content, "tabs-content")
      setIdRefs(trigger, "aria-controls", content)
      setIdRefs(content, "aria-labelledby", trigger)
    })
  }

  setupTabs() {
    // Set initial active tab based on defaultValue
    const activeValue = this.defaultValueValue

    this.triggerTargets.forEach((trigger) => {
      const value = trigger.dataset.value
      const isActive = value === activeValue

      if (isActive) {
        this.activateTrigger(trigger)
      } else {
        this.deactivateTrigger(trigger)
      }
    })

    // Keep the tablist reachable with Tab when no tab is active
    if (!this.triggerTargets.some((t) => t.getAttribute("tabindex") === "0")) {
      const first = this.enabledTriggers()[0]
      if (first) first.setAttribute("tabindex", "0")
    }

    this.contentTargets.forEach((content) => {
      const value = content.dataset.value
      const isActive = value === activeValue

      if (isActive) {
        this.showContent(content)
      } else {
        this.hideContent(content)
      }
    })
  }

  enabledTriggers() {
    return this.triggerTargets.filter((t) => !this.isDisabled(t))
  }

  isDisabled(trigger) {
    return trigger.disabled || trigger.hasAttribute("data-disabled") || trigger.getAttribute("aria-disabled") === "true"
  }

  selectTab(event) {
    const trigger = event.currentTarget
    if (this.isDisabled(trigger)) return
    const value = trigger.dataset.value

    // Deactivate all triggers
    this.triggerTargets.forEach((t) => {
      this.deactivateTrigger(t)
    })

    // Activate clicked trigger
    this.activateTrigger(trigger)

    // Hide all content panels
    this.contentTargets.forEach((content) => {
      this.hideContent(content)
    })

    // Show matching content
    const content = this.contentTargets.find((c) => c.dataset.value === value)
    if (content) {
      this.showContent(content)
    }

    // Focus the trigger
    trigger.focus()
  }

  activateTrigger(trigger) {
    setState(trigger, 'active')
    trigger.setAttribute("aria-selected", "true")
    trigger.setAttribute("tabindex", "0")
  }

  deactivateTrigger(trigger) {
    setState(trigger, 'inactive')
    trigger.setAttribute("aria-selected", "false")
    trigger.setAttribute("tabindex", "-1")
  }

  showContent(content) {
    setState(content, 'active')
    content.removeAttribute("hidden")
  }

  hideContent(content) {
    setState(content, 'inactive')
    content.setAttribute("hidden", "")
  }

  // Bound with data-action on each trigger (keydown->ui--tabs#handleKeyDown)
  handleKeyDown(event) {
    const trigger = event.currentTarget
    // Disabled tabs are skipped (Radix focusable={!disabled})
    const triggers = this.enabledTriggers()
    const currentIndex = triggers.indexOf(trigger)
    if (currentIndex === -1 || triggers.length === 0) return

    let nextIndex = currentIndex

    // Determine next trigger based on orientation
    const isHorizontal = this.orientationValue === "horizontal"

    switch (event.key) {
      case "ArrowRight":
        if (isHorizontal) {
          event.preventDefault()
          nextIndex = (currentIndex + 1) % triggers.length
        }
        break
      case "ArrowLeft":
        if (isHorizontal) {
          event.preventDefault()
          nextIndex = currentIndex - 1 < 0 ? triggers.length - 1 : currentIndex - 1
        }
        break
      case "ArrowDown":
        if (!isHorizontal) {
          event.preventDefault()
          nextIndex = (currentIndex + 1) % triggers.length
        }
        break
      case "ArrowUp":
        if (!isHorizontal) {
          event.preventDefault()
          nextIndex = currentIndex - 1 < 0 ? triggers.length - 1 : currentIndex - 1
        }
        break
      case "Home":
        event.preventDefault()
        nextIndex = 0
        break
      case "End":
        event.preventDefault()
        nextIndex = triggers.length - 1
        break
      default:
        return
    }

    // Focus next trigger
    const nextTrigger = triggers[nextIndex]
    if (nextTrigger) {
      nextTrigger.focus()

      // Activate in automatic mode
      if (this.activationModeValue === "automatic") {
        nextTrigger.click()
      }
    }
  }
}
