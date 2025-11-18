// Entry point for bundled JavaScript (jsbundling-rails with Bun)
console.log("Bundled JavaScript loaded successfully!");

// Import Turbo for SPA-like navigation
import "@hotwired/turbo"

// Import the UI engine from npm package
import UI from "@ui/engine";

// Initialize the UI engine
UI.init();

// Log for verification
console.log("UI Engine version:", UI.version);
