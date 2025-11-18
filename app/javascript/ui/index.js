/**
 * UI Engine - Main JavaScript Entry Point
 *
 * This file serves as the main entry point for the UI engine's JavaScript.
 * It can be imported via importmaps or bundled with npm-based builds.
 */

console.log("UI Engine JavaScript loaded!");

// Create a global UI object for non-module usage
window.UI = {
  version: "0.1.0",

  // Initialize the UI engine
  init() {
    console.log("UI Engine initialized");
    // Add any initialization logic here
  }
};

// Also export for module usage
export default window.UI;
