import { Controller } from "@hotwired/stimulus"

// Avatar controller for handling image load and fallback display
//
// Based on shadcn/ui Avatar: https://ui.shadcn.com/docs/components/avatar
// Based on Radix UI Avatar: https://www.radix-ui.com/primitives/docs/components/avatar
export default class extends Controller {
  static targets = ["image", "fallback"]

  connect() {
    // If image target exists, listen for load/error events
    if (this.hasImageTarget) {
      // Bind methods for event listeners
      this.boundOnImageLoad = this.onImageLoad.bind(this)
      this.boundOnImageError = this.onImageError.bind(this)

      this.setupImageHandlers()
    }
  }

  setupImageHandlers() {
    // Check if image is already loaded (from cache)
    if (this.imageTarget.complete) {
      // Image is already loaded (from cache)
      if (this.imageTarget.naturalHeight > 0) {
        // Image loaded successfully
        this.showImage()
        this.hideFallback()
      } else {
        // Image failed to load
        this.hideImage()
        this.showFallback()
      }
    } else {
      // Image not loaded yet, add event listeners
      this.imageTarget.addEventListener("load", this.boundOnImageLoad)
      this.imageTarget.addEventListener("error", this.boundOnImageError)
    }
  }

  onImageLoad() {
    // Image loaded successfully, show image and hide fallback
    this.showImage()
    this.hideFallback()
  }

  onImageError() {
    // Image failed to load, hide image and show fallback
    this.hideImage()
    this.showFallback()
  }

  showImage() {
    if (this.hasImageTarget) {
      this.imageTarget.classList.remove("hidden")
    }
  }

  hideImage() {
    if (this.hasImageTarget) {
      this.imageTarget.classList.add("hidden")
    }
  }

  hideFallback() {
    if (this.hasFallbackTarget) {
      this.fallbackTarget.classList.add("hidden")
    }
  }

  showFallback() {
    if (this.hasFallbackTarget) {
      this.fallbackTarget.classList.remove("hidden")
    }
  }

  disconnect() {
    // Clean up event listeners
    if (this.hasImageTarget && this.boundOnImageLoad) {
      this.imageTarget.removeEventListener("load", this.boundOnImageLoad)
      this.imageTarget.removeEventListener("error", this.boundOnImageError)
    }
  }
}
