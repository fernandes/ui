import { Controller } from "@hotwired/stimulus"
import EmblaCarousel from "embla-carousel"
import Autoplay from "embla-carousel-autoplay"

export default class extends Controller {
  static targets = ["viewport", "prevButton", "nextButton", "container", "autoplayToggle"]
  static values = {
    orientation: { type: String, default: "horizontal" },
    opts: { type: Object, default: {} },
    plugins: { type: Array, default: [] }
  }

  connect() {
    this.initializeCarousel()
  }

  disconnect() {
    if (this.emblaApi) {
      this.emblaApi.destroy()
      this.emblaApi = null
    }
  }

  initializeCarousel() {
    if (!this.hasViewportTarget) {
      console.error("Carousel: viewport target not found")
      return
    }

    // Apply orientation classes to the flex container
    this.applyOrientationClasses()

    // Merge default options with user options
    const options = {
      ...this.optsValue,
      axis: this.orientationValue === "vertical" ? "y" : "x"
    }

    // Process plugins
    const plugins = this.buildPlugins()

    // Initialize Embla Carousel with plugins
    this.emblaApi = EmblaCarousel(this.viewportTarget, options, plugins)

    // Setup button states
    this.setupButtonStates()

    // Listen for carousel events
    this.emblaApi.on("select", () => this.updateButtonStates())
    this.emblaApi.on("reInit", () => this.updateButtonStates())

    // Autoplay: live region off while rotating, pause control in sync (WCAG 2.2.2)
    this.userPaused = false
    this.emblaApi.on("autoplay:play", () => this.onAutoplayPlay())
    this.emblaApi.on("autoplay:stop", () => this.syncAutoplayState())
    this.syncAutoplayState()

    // Dispatch custom event with API
    this.element.dispatchEvent(new CustomEvent("carousel:init", {
      detail: { api: this.emblaApi },
      bubbles: true
    }))
  }

  buildPlugins() {
    const plugins = []

    // Process plugin configurations from pluginsValue
    this.pluginsValue.forEach(pluginConfig => {
      if (pluginConfig.name === "autoplay") {
        // Pause while the pointer is over the carousel unless the author
        // opted out (WCAG 2.2.2); focus inside already pauses it (Embla default)
        plugins.push(Autoplay({ stopOnMouseEnter: true, ...(pluginConfig.options || {}) }))
      }
      // Add more plugins here as needed
    })

    return plugins
  }

  applyOrientationClasses() {
    if (!this.hasContainerTarget) {
      console.error("Carousel: container target not found")
      return
    }

    // Find all carousel items
    const items = this.element.querySelectorAll('[role="group"]')

    if (this.orientationValue === "vertical") {
      // Add vertical flex direction
      this.containerTarget.classList.add("flex-col")

      // Remove horizontal margin from container (user may have provided vertical margin like -mt-1)
      this.containerTarget.classList.remove("-ml-4", "-ml-1", "-ml-2", "-ml-3")

      // Remove horizontal padding from items (keep vertical padding from user classes)
      items.forEach(item => {
        item.classList.remove("pl-4", "pl-1", "pl-2", "pl-3")
      })

      // Adjust buttons for vertical layout (with border)
      if (this.hasPrevButtonTarget) {
        this.prevButtonTarget.classList.remove("top-1/2", "-translate-y-1/2", "-left-12", "rounded-lg", "border-0")
        this.prevButtonTarget.classList.add("left-1/2", "-translate-x-1/2", "-top-12", "rotate-90", "rounded-full", "border", "border-input")
      }
      if (this.hasNextButtonTarget) {
        this.nextButtonTarget.classList.remove("top-1/2", "-translate-y-1/2", "-right-12", "rounded-lg", "border-0")
        this.nextButtonTarget.classList.add("left-1/2", "-translate-x-1/2", "-bottom-12", "rotate-90", "rounded-full", "border", "border-input")
      }
    } else {
      // Remove vertical flex direction (horizontal is default)
      this.containerTarget.classList.remove("flex-col")

      // Add horizontal padding to items if no padding class present
      items.forEach(item => {
        const hasPadding = Array.from(item.classList).some(cls => /^pl-\d+$/.test(cls))
        if (!hasPadding) {
          item.classList.add("pl-4")
        }
      })

      // Ensure buttons have horizontal positioning (without border)
      if (this.hasPrevButtonTarget) {
        this.prevButtonTarget.classList.remove("left-1/2", "-translate-x-1/2", "-top-12", "rotate-90", "rounded-full", "border", "border-input")
        if (!this.prevButtonTarget.classList.contains("top-1/2")) {
          this.prevButtonTarget.classList.add("top-1/2", "-translate-y-1/2", "-left-12", "rounded-lg", "border-0")
        }
      }
      if (this.hasNextButtonTarget) {
        this.nextButtonTarget.classList.remove("left-1/2", "-translate-x-1/2", "-bottom-12", "rotate-90", "rounded-full", "border", "border-input")
        if (!this.nextButtonTarget.classList.contains("top-1/2")) {
          this.nextButtonTarget.classList.add("top-1/2", "-translate-y-1/2", "-right-12", "rounded-lg", "border-0")
        }
      }
    }
  }

  setupButtonStates() {
    this.updateButtonStates()
  }

  get autoplay() {
    return this.emblaApi?.plugins?.()?.autoplay
  }

  isAutoplaying() {
    return !!this.autoplay?.isPlaying?.()
  }

  // A pause the user asked for wins over Embla resuming on mouseleave /
  // focusout (stopOnInteraction: false)
  onAutoplayPlay() {
    if (this.userPaused) {
      this.autoplay.stop()
      return
    }
    this.syncAutoplayState()
  }

  // Play / pause control: any button with
  // data-ui--carousel-target="autoplayToggle" data-action="ui--carousel#toggleAutoplay"
  toggleAutoplay() {
    const autoplay = this.autoplay
    if (!autoplay) return

    if (autoplay.isPlaying()) {
      this.userPaused = true
      autoplay.stop()
    } else {
      this.userPaused = false
      autoplay.play()
    }
    this.syncAutoplayState()
  }

  // APG carousel: slide changes are announced (aria-live="polite") unless
  // the carousel rotates on its own; then the live region is off.
  syncAutoplayState() {
    const playing = this.isAutoplaying()

    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("aria-live", playing ? "off" : "polite")
    }

    this.autoplayToggleTargets.forEach((toggle) => {
      toggle.hidden = !this.autoplay
      toggle.dataset.state = playing ? "playing" : "paused"
      const label = playing
        ? (toggle.dataset.pauseLabel || "Pause slides")
        : (toggle.dataset.playLabel || "Play slides")
      toggle.setAttribute("aria-label", label)
      // Plain-text buttons show the label; icon buttons keep their content
      if (toggle.children.length === 0) toggle.textContent = label
    })
  }

  updateButtonStates() {
    if (!this.emblaApi) return

    if (this.hasPrevButtonTarget) {
      this.setButtonEnabled(this.prevButtonTarget, this.emblaApi.canScrollPrev())
    }
    if (this.hasNextButtonTarget) {
      this.setButtonEnabled(this.nextButtonTarget, this.emblaApi.canScrollNext())
    }
  }

  // aria-disabled instead of disabled: a focused button that reaches the
  // end keeps focus instead of dropping it to <body>
  setButtonEnabled(button, enabled) {
    button.disabled = false
    if (enabled) {
      button.removeAttribute("aria-disabled")
    } else {
      button.setAttribute("aria-disabled", "true")
    }
    button.classList.toggle("opacity-50", !enabled)
    button.classList.toggle("cursor-not-allowed", !enabled)
  }

  scrollPrev() {
    if (this.emblaApi) {
      this.emblaApi.scrollPrev()
    }
  }

  scrollNext() {
    if (this.emblaApi) {
      this.emblaApi.scrollNext()
    }
  }

  // Public method to get the Embla API
  getApi() {
    return this.emblaApi
  }

  // Keyboard navigation, bound on the root (keydown->ui--carousel#keydown)
  // like shadcn's onKeyDownCapture. Arrows inside text fields are left alone.
  keydown(event) {
    if (this.isEditable(event.target)) return

    if (this.orientationValue === "horizontal") {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        this.scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        this.scrollNext()
      }
    } else {
      if (event.key === "ArrowUp") {
        event.preventDefault()
        this.scrollPrev()
      } else if (event.key === "ArrowDown") {
        event.preventDefault()
        this.scrollNext()
      }
    }
  }

  isEditable(element) {
    if (!(element instanceof HTMLElement)) return false
    return element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)
  }
}
