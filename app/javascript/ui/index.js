/**
 * UI Engine - Main Entry Point
 *
 * This file is the single source for both importmap and bundler usage.
 * Rollup generates two outputs from this file:
 * - UMD format (ui.js) for importmaps
 * - ESM format (ui.esm.js) for npm packages/bundlers
 */

// Import controllers
import HelloController from "./controllers/hello_controller.js";
import DropdownController from "./controllers/dropdown_controller.js";
import AccordionController from "./controllers/accordion_controller.js";
import AlertDialogController from "./controllers/alert_dialog_controller.js";
import AvatarController from "./controllers/avatar_controller.js";
import DialogController from "./controllers/dialog_controller.js";
import CheckboxController from "./controllers/checkbox_controller.js";
import CollapsibleController from "./controllers/collapsible_controller.js";
import CommandController from "./controllers/command_controller.js";
import CommandDialogController from "./controllers/command_dialog_controller.js";
import TooltipController from "./controllers/tooltip_controller.js";
import PopoverController from "./controllers/popover_controller.js";
import ScrollAreaController from "./controllers/scroll_area_controller.js";
import SelectController from "./controllers/select_controller.js";

// Import registration function
import { registerControllersInto } from "./common.js";

// Version
export const version = "0.1.0";

// Register controllers into a provided Stimulus application
export function registerControllers(application) {
  return registerControllersInto(application, {
    "ui--hello": HelloController,
    "ui--dropdown": DropdownController,
    "ui--accordion": AccordionController,
    "ui--alert-dialog": AlertDialogController,
    "ui--avatar": AvatarController,
    "ui--dialog": DialogController,
    "ui--checkbox": CheckboxController,
    "ui--collapsible": CollapsibleController,
    "ui--command": CommandController,
    "ui--command-dialog": CommandDialogController,
    "ui--tooltip": TooltipController,
    "ui--popover": PopoverController,
    "ui--scroll-area": ScrollAreaController,
    "ui--select": SelectController
  });
}

// Re-export helper
export { registerControllersInto };

// Export individual controllers for selective import
export { HelloController, DropdownController, AccordionController, AlertDialogController, AvatarController, DialogController, CheckboxController, CollapsibleController, CommandController, CommandDialogController, TooltipController, PopoverController, ScrollAreaController, SelectController };
