import AccordionController from "ui/accordion_controller"
import AccordionItemController from "ui/accordion_item_controller"
import AvatarController from "ui/avatar_controller"
import CalendarController from "ui/calendar_controller"
import CheckboxController from "ui/checkbox_controller"
import CollapsibleController from "ui/collapsible_controller"
import ComboboxController from "ui/combobox_controller"
import ComboboxContentController from "ui/combobox_content_controller"
import ComboboxTriggerController from "ui/combobox_trigger_controller"
import ContextMenuController from "ui/context_menu_controller"
import DatePickerController from "ui/date_picker_controller"
import DropdownCheckboxController from "ui/dropdown_checkbox_controller"
import DropdownContentController from "ui/dropdown_content_controller"
import DropdownMenuController from "ui/dropdown_menu_controller"
import DropdownRadioGroupController from "ui/dropdown_radio_group_controller"
import DropdownSubmenuController from "ui/dropdown_submenu_controller"
import FilterController from "ui/filter_controller"
import InputOtpController from "ui/input_otp_controller"
import PopoverController from "ui/popover_controller"
import RadioGroupController from "ui/radio_group_controller"
import ScrollButtonsController from "ui/scroll_buttons_controller"
import SelectController from "ui/select_controller"
import SelectItemController from "ui/select_item_controller"
import SwitchController from "ui/switch_controller"
import TabsController from "ui/tabs_controller"
import ToggleController from "ui/toggle_controller"
import ToggleGroupController from "ui/toggle_group_controller"

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
  registerControllers
}
