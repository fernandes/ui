/**
 * UI Engine - Stimulus Application (Importmap)
 *
 * This file initializes the Stimulus application for importmap usage.
 * Uses absolute imports that are resolved by importmap.
 */

// Import controllers with absolute paths (for importmap)
import HelloController from "ui/controllers/hello_controller"
import DropdownController from "ui/controllers/dropdown_controller"

// Import shared logic
import { createStimulusApplication } from "ui/common"

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
