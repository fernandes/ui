import { Controller } from "@hotwired/stimulus"
import EmblaCarousel from "embla-carousel"
import Autoplay from "embla-carousel-autoplay"

export default class extends Controller {
  static targets = ["viewport", "prevButton", "nextButton", "container"]
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
        plugins.push(Autoplay(pluginConfig.options || {}))
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

  updateButtonStates() {
    if (!this.emblaApi) return

    // Update previous button state
    if (this.hasPrevButtonTarget) {
      const canScrollPrev = this.emblaApi.canScrollPrev()
      this.prevButtonTarget.disabled = !canScrollPrev
      this.prevButtonTarget.classList.toggle("opacity-50", !canScrollPrev)
      this.prevButtonTarget.classList.toggle("cursor-not-allowed", !canScrollPrev)
    }

    // Update next button state
    if (this.hasNextButtonTarget) {
      const canScrollNext = this.emblaApi.canScrollNext()
      this.nextButtonTarget.disabled = !canScrollNext
      this.nextButtonTarget.classList.toggle("opacity-50", !canScrollNext)
      this.nextButtonTarget.classList.toggle("cursor-not-allowed", !canScrollNext)
    }
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

  // Handle keyboard navigation
  keydown(event) {
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
}
