/**
 * UI Engine - Common Logic
 *
 * This file contains all shared logic for the UI engine.
 * Used by both importmap and bundler setups.
 */

import { Application } from "@hotwired/stimulus"

console.log("UI Engine JavaScript loaded!");

/**
 * Creates and configures a Stimulus application with all engine controllers
 * @param {Object} controllers - Object with controller name/class pairs
 * @returns {Object} - Object containing application and registration functions
 */
export function createStimulusApplication(controllers) {
  // Create the Stimulus application
  const application = Application.start()

  // Configure Stimulus development experience
  application.debug = false
  window.Stimulus = application

  /**
   * Register a controller with the application
   * @param {string} name - Controller identifier (e.g., "ui--hello")
   * @param {Function} controllerConstructor - Controller class
   */
  function registerController(name, controllerConstructor) {
    application.register(name, controllerConstructor)
    console.log(`Registered Stimulus controller: ${name}`)
  }

  /**
   * Auto-register all engine controllers with 'ui--' prefix
   */
  function autoRegisterEngineControllers() {
    // Register each controller
    for (const [name, controller] of Object.entries(controllers)) {
      try {
        registerController(name, controller)
      } catch (error) {
        console.error(`Failed to register controller ${name}:`, error)
      }
    }
  }

  return {
    application,
    registerController,
    autoRegisterEngineControllers
  }
}

/**
 * Creates the UI Engine global object
 * @param {Object} stimulusApp - The Stimulus application instance
 * @param {Function} autoRegisterEngineControllers - Function to auto-register controllers
 * @param {Function} registerController - Function to register a controller
 * @returns {Object} - Object with UI, stimulus, application, and registration functions
 */
export function createUIEngine(stimulusApp, autoRegisterEngineControllers, registerController) {
  // Create a global UI object for non-module usage
  const UI = {
    version: "0.1.0",
    stimulus: stimulusApp,

    // Initialize the UI engine
    init() {
      console.log("UI Engine initialized");

      // Auto-register engine controllers
      if (typeof window !== 'undefined' && !window.__UI_CONTROLLERS_REGISTERED__) {
        autoRegisterEngineControllers()
        window.__UI_CONTROLLERS_REGISTERED__ = true
      }
    },

    // Register controllers into a provided Stimulus application
    async registerControllers(application) {
      return registerControllersInto(application)
    }
  };

  // Set global
  window.UI = UI

  return {
    UI,
    stimulus: stimulusApp,
    application: stimulusApp,
    registerController,
    autoRegisterEngineControllers
  }
}

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
      console.log(`Registered Stimulus controller: ${name}`)
    } catch (error) {
      console.error(`Failed to register controller ${name}:`, error)
    }
  }
}
