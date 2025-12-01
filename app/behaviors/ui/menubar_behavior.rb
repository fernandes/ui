# frozen_string_literal: true

# UI::MenubarBehavior
#
# @ui_component Menubar
# @ui_description Menubar - Phlex implementation
# @ui_category navigation
#
# @ui_anatomy Menubar - Container for horizontal menu bar with Stimulus controller for interactivity. (required)
# @ui_anatomy Content - Container for menu items that appears when trigger is activated. (required)
# @ui_anatomy Item - A selectable menu item.
# @ui_anatomy Label - Non-interactive label/header for menu sections.
# @ui_anatomy Separator - Visual divider between menu items.
# @ui_anatomy Shortcut - Displays keyboard shortcut hint for menu items.
# @ui_anatomy Sub - Container for submenu within the menubar menu.
# @ui_anatomy Sub Content - Container for submenu items. (required)
# @ui_anatomy Sub Trigger - Menu item that opens a submenu. (required)
# @ui_anatomy Trigger - Button that toggles the menu content open/closed. (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature ARIA attributes for accessibility
# @ui_feature Keyboard navigation with arrow keys
# @ui_feature Click outside to close
#
# @ui_aria_pattern Menu Bar
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
# @ui_aria_attr aria-label
# @ui_aria_attr role="menubar"
#
# @ui_keyboard Enter Activates the focused element
# @ui_keyboard Space Activates the focused element
# @ui_keyboard Escape Closes the component
# @ui_keyboard ArrowDown Moves focus to next item
# @ui_keyboard ArrowUp Moves focus to previous item
# @ui_keyboard ArrowLeft Moves focus left or decreases value
# @ui_keyboard ArrowRight Moves focus right or increases value
# @ui_keyboard Home Moves focus to first item
# @ui_keyboard End Moves focus to last item
# @ui_keyboard Tab Moves focus to next focusable element
#
# @ui_related dropdown_menu
# @ui_related context_menu
# @ui_related navigation_menu
#
module UI::MenubarBehavior
  # Returns HTML attributes for the menubar container
  def menubar_html_attributes
    attrs = {
      class: menubar_classes,
      data: menubar_data_attributes,
      role: "menubar"
    }

    # Add aria-label if provided
    attrs[:"aria-label"] = @aria_label if defined?(@aria_label) && @aria_label

    attrs
  end

  # Returns combined CSS classes for the menubar
  def menubar_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for Stimulus controller
  def menubar_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    base_data = {
      controller: "ui--menubar"
    }

    # Add loop value if specified
    base_data[:"ui--menubar-loop-value"] = @loop if defined?(@loop) && @loop

    (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
  end
end
