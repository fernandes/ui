/**
 * UI Engine - Stimulus Application (Bundler)
 *
 * This file initializes the Stimulus application for bundler usage.
 * Uses relative imports that bundlers can resolve.
 */

// Import controllers with relative paths (for bundlers)
import HelloController from "./controllers/hello_controller.js"
import DropdownController from "./controllers/dropdown_controller.js"

// Import shared logic
import { createStimulusApplication } from "./common.js"

// Create application with all controllers
const { application, registerController, autoRegisterEngineControllers } = createStimulusApplication({
  "ui--hello": HelloController,
  "ui--dropdown": DropdownController
})

// Export for different usage patterns
export default application
export {
  application,
  registerController,
  autoRegisterEngineControllers
}
