// Entry point for the dummy app JavaScript (importmap)
console.log("Dummy app JavaScript loaded successfully!");

// Import Turbo for SPA-like navigation
import "@hotwired/turbo-rails"

// Import Stimulus
import { Application } from "@hotwired/stimulus"

// Import the UI engine
import UI from "ui"

// Create Stimulus application
const application = Application.start()
window.Stimulus = application

// Register all UI engine controllers automatically
UI.registerControllers(application)

console.log("Stimulus controllers registered:",
  Array.from(application.router.modulesByIdentifier.keys()))

// Log for verification
console.log("UI Engine version:", UI.version)
