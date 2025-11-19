/**
 * UI Engine - Main Entry Point
 *
 * This file is the single source for both importmap and bundler usage.
 * Rollup generates two outputs from this file:
 * - UMD format (ui.js) for importmaps
 * - ESM format (ui.esm.js) for npm packages/bundlers
 */

console.log("UI Engine JavaScript loaded!");

// Import controllers
import HelloController from "./controllers/hello_controller.js";
import DropdownController from "./controllers/dropdown_controller.js";

// Import registration function
import { registerControllersInto } from "./common.js";

// Version
export const version = "0.1.0";

// Register controllers into a provided Stimulus application
export function registerControllers(application) {
  return registerControllersInto(application, {
    "ui--hello": HelloController,
    "ui--dropdown": DropdownController
  });
}

// Re-export helper
export { registerControllersInto };
