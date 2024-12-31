import AccordionController from "./controllers/ui/accordion_controller"
import AccordionItemController from "./controllers/ui/accordion_item_controller"
import AvatarController from "./controllers/ui/avatar_controller"
import CalendarController from "./controllers/ui/calendar_controller"
import CheckboxController from "./controllers/ui/checkbox_controller"
import CollapsibleController from "./controllers/ui/collapsible_controller"
import ComboboxController from "./controllers/ui/combobox_controller"
import ComboboxContentController from "./controllers/ui/combobox_content_controller"
import ComboboxTriggerController from "./controllers/ui/combobox_trigger_controller"
import ContextMenuController from "./controllers/ui/context_menu_controller"
import DatePickerController from "./controllers/ui/date_picker_controller"
import DropdownCheckboxController from "./controllers/ui/dropdown_checkbox_controller"
import DropdownContentController from "./controllers/ui/dropdown_content_controller"
import DropdownMenuController from "./controllers/ui/dropdown_menu_controller"
import DropdownRadioGroupController from "./controllers/ui/dropdown_radio_group_controller"
import DropdownSubmenuController from "./controllers/ui/dropdown_submenu_controller"
import FilterController from "./controllers/ui/filter_controller"
import InputOtpController from "./controllers/ui/input_otp_controller"
import PopoverController from "./controllers/ui/popover_controller"
import RadioGroupController from "./controllers/ui/radio_group_controller"
import ScrollButtonsController from "./controllers/ui/scroll_buttons_controller"
import SelectController from "./controllers/ui/select_controller"
import SelectItemController from "./controllers/ui/select_item_controller"
import SwitchController from "./controllers/ui/switch_controller"
import TabsController from "./controllers/ui/tabs_controller"
import ToggleController from "./controllers/ui/toggle_controller"
import ToggleGroupController from "./controllers/ui/toggle_group_controller"

const registerControllers = (application) => {
  application.register("ui--accordion", AccordionController)
  application.register("ui--accordion-item", AccordionItemController)
  application.register("ui--avatar", AvatarController)
  application.register("ui--calendar", CalendarController)
  application.register("ui--checkbox", CheckboxController)
  application.register("ui--collapsible", CollapsibleController)
  application.register("ui--combobox", ComboboxController)
  application.register("ui--combobox-content", ComboboxContentController)
  application.register("ui--combobox-trigger", ComboboxTriggerController)
  application.register("ui--context-menu", ContextMenuController)
  application.register("ui--date-picker", DatePickerController)
  application.register("ui--dropdown-content", DropdownContentController)
  application.register("ui--dropdown-checkbox", DropdownCheckboxController)
  application.register("ui--dropdown-menu", DropdownMenuController)
  application.register("ui--dropdown-radio-group", DropdownRadioGroupController)
  application.register("ui--dropdown-submenu", DropdownSubmenuController)
  application.register("ui--filter", FilterController)
  application.register("ui--input-otp", InputOtpController)
  application.register("ui--popover", PopoverController)
  application.register("ui--radio-group", RadioGroupController)
  application.register("ui--select", SelectController)
  application.register("ui--select-item", SelectItemController)
  application.register("ui--scroll-buttons", ScrollButtonsController)
  application.register("ui--switch", SwitchController)
  application.register("ui--tabs", TabsController)
  application.register("ui--toggle", ToggleController)
  application.register("ui--toggle-group", ToggleGroupController)
}

export {
  AccordionController,
  AccordionItemController,
  AvatarController,
  CheckboxController,
  CollapsibleController,
  ComboboxController,
  ComboboxContentController,
  ComboboxTriggerController,
  ContextMenuController,
  DatePickerController,
  DropdownCheckboxController,
  DropdownContentController,
  DropdownMenuController,
  DropdownRadioGroupController,
  DropdownSubmenuController,
  FilterController,
  InputOtpController,
  PopoverController,
  RadioGroupController,
  SelectController,
  SelectItemController,
  ScrollButtonsController,
  SwitchController,
  TabsController,
  ToggleController,
  ToggleGroupController,
  registerControllers
}
