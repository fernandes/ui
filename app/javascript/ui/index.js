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
import ComboboxController from "./controllers/combobox_controller.js";
import CommandController from "./controllers/command_controller.js";
import ContextMenuController from "./controllers/context_menu_controller.js";
import CommandDialogController from "./controllers/command_dialog_controller.js";
import DrawerController from "./controllers/drawer_controller.js";
import HoverCardController from "./controllers/hover_card_controller.js";
import InputOtpController from "./controllers/input_otp_controller.js";
import TooltipController from "./controllers/tooltip_controller.js";
import PopoverController from "./controllers/popover_controller.js";
import ResponsiveDialogController from "./controllers/responsive_dialog_controller.js";
import ScrollAreaController from "./controllers/scroll_area_controller.js";
import SelectController from "./controllers/select_controller.js";
import SonnerController from "./controllers/sonner_controller.js";
import ToggleController from "./controllers/toggle_controller.js";
import ToggleGroupController from "./controllers/toggle_group_controller.js";
import TabsController from "./controllers/tabs_controller.js";
import SliderController from "./controllers/slider_controller.js";
import SwitchController from "./controllers/switch_controller.js";
import CalendarController from "./controllers/calendar_controller.js";
import CarouselController from "./controllers/carousel_controller.js";
import DatepickerController from "./controllers/datepicker_controller.js";

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
    "ui--drawer": DrawerController,
    "ui--checkbox": CheckboxController,
    "ui--collapsible": CollapsibleController,
    "ui--combobox": ComboboxController,
    "ui--command": CommandController,
    "ui--command-dialog": CommandDialogController,
    "ui--context-menu": ContextMenuController,
    "ui--hover-card": HoverCardController,
    "ui--input-otp": InputOtpController,
    "ui--tooltip": TooltipController,
    "ui--popover": PopoverController,
    "ui--responsive-dialog": ResponsiveDialogController,
    "ui--scroll-area": ScrollAreaController,
    "ui--select": SelectController,
    "ui--slider": SliderController,
    "ui--sonner": SonnerController,
    "ui--switch": SwitchController,
    "ui--tabs": TabsController,
    "ui--toggle": ToggleController,
    "ui--toggle-group": ToggleGroupController,
    "ui--calendar": CalendarController,
    "ui--carousel": CarouselController,
    "ui--datepicker": DatepickerController
  });
}

// Re-export helper
export { registerControllersInto };

// Export individual controllers for selective import
export { HelloController, DropdownController, AccordionController, AlertDialogController, AvatarController, CalendarController, CarouselController, DatepickerController, DialogController, DrawerController, CheckboxController, CollapsibleController, ComboboxController, CommandController, CommandDialogController, ContextMenuController, HoverCardController, InputOtpController, TooltipController, PopoverController, ResponsiveDialogController, ScrollAreaController, SelectController, SliderController, SonnerController, SwitchController, TabsController, ToggleController, ToggleGroupController };
