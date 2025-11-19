// Entry point for bundled JavaScript (jsbundling-rails with Bun)
console.log("Bundled JavaScript loaded successfully!");

// Import Turbo for SPA-like navigation
import "@hotwired/turbo"

// Import Stimulus
import { Application } from "@hotwired/stimulus"

// Import the UI engine
import * as UI from "@ui/engine"

// Create Stimulus application
const application = Application.start()
window.Stimulus = application

// Register all UI engine controllers automatically
UI.registerControllers(application)

console.log("Stimulus controllers registered:",
  Array.from(application.router.modulesByIdentifier.keys()))

// Log for verification
console.log("UI Engine version:", UI.version)
