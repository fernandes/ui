/**
 * UI Engine - Common Logic
 *
 * This file contains all shared logic for the UI engine.
 * Used by both importmap and bundler setups.
 */

/**
 * Register all UI engine controllers into a provided Stimulus application
 * Useful for bundler setups where you want to use your own Stimulus instance
 * @param {Application} application - The Stimulus application to register controllers into
 * @param {Object} controllers - Object with controller name/class pairs
 */
export function registerControllersInto(application, controllers) {
  // Register each controller
  for (const [name, controller] of Object.entries(controllers)) {
    try {
      application.register(name, controller)
    } catch (error) {
      console.error(`Failed to register controller ${name}:`, error)
    }
  }
}
