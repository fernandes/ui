/**
 * UI Engine - Bundler Entry Point
 *
 * This file is specifically for bundler usage (Webpack, Bun, esbuild, etc.)
 * Uses relative imports that bundlers can resolve.
 */

// Import Stimulus application with relative paths (for bundlers)
import {
  application as stimulusApp,
  autoRegisterEngineControllers,
  registerController
} from "./application-bundler.js"

// Import controllers directly
import HelloController from "./controllers/hello_controller.js"
import DropdownController from "./controllers/dropdown_controller.js"

// Import shared logic
import { createUIEngine, registerControllersInto } from "./common.js"

// Create UI Engine
const { UI, stimulus, application } = createUIEngine(
  stimulusApp,
  autoRegisterEngineControllers,
  registerController
)

// Add helper function to register controllers in external Stimulus app
UI.registerControllers = function(externalApp) {
  return registerControllersInto(externalApp, {
    "ui--hello": HelloController,
    "ui--dropdown": DropdownController
  })
}

// Export for module usage
export default UI
export {
  stimulus,
  application,
  registerController,
  autoRegisterEngineControllers,
  registerControllersInto
}
