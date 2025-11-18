/**
 * UI Engine - Main JavaScript Entry Point (Importmap)
 *
 * This file serves as the main entry point for the UI engine when using importmaps.
 * For importmap usage, import controllers and register them manually.
 */

console.log("UI Engine JavaScript loaded!");

// Import controllers with absolute paths (for importmap)
import HelloController from "ui/controllers/hello_controller"
import DropdownController from "ui/controllers/dropdown_controller"

// Import registration function
import { registerControllersInto } from "ui/common"

// Create UI Engine object (lightweight, no internal Stimulus app)
const UI = {
  version: "0.1.0",

  // Register controllers into a provided Stimulus application
  registerControllers(application) {
    return registerControllersInto(application, {
      "ui--hello": HelloController,
      "ui--dropdown": DropdownController
    })
  }
}

// Set global
window.UI = UI

// Export for module usage
export default UI
export { registerControllersInto }
