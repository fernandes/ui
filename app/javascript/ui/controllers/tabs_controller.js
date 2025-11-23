import { Controller } from "@hotwired/stimulus"

// Tabs controller for tabbed interface with keyboard navigation
export default class extends Controller {
  static targets = ["trigger", "content"]
  static values = {
    defaultValue: { type: String, default: "" },
    orientation: { type: String, default: "horizontal" },
    activationMode: { type: String, default: "automatic" }
  }

  connect() {
    this.setupTabs()
    this.setupKeyboardNavigation()
  }

  setupTabs() {
    // Set initial active tab based on defaultValue
    const activeValue = this.defaultValueValue

    this.triggerTargets.forEach((trigger) => {
      const value = trigger.dataset.value
      const isActive = value === activeValue

      if (isActive) {
        this.activateTrigger(trigger)
      }
    })

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

  setupKeyboardNavigation() {
    this.triggerTargets.forEach((trigger) => {
      trigger.addEventListener("keydown", this.handleKeyDown.bind(this))
    })
  }

  selectTab(event) {
    const trigger = event.currentTarget
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
    trigger.dataset.state = "active"
    trigger.setAttribute("aria-selected", "true")
    trigger.setAttribute("tabindex", "0")
  }

  deactivateTrigger(trigger) {
    trigger.dataset.state = "inactive"
    trigger.setAttribute("aria-selected", "false")
    trigger.setAttribute("tabindex", "-1")
  }

  showContent(content) {
    content.dataset.state = "active"
    content.removeAttribute("hidden")
  }

  hideContent(content) {
    content.dataset.state = "inactive"
    content.setAttribute("hidden", "")
  }

  handleKeyDown(event) {
    const trigger = event.target
    const triggers = this.triggerTargets
    const currentIndex = triggers.indexOf(trigger)

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
