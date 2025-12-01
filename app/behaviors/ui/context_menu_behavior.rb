# frozen_string_literal: true

# UI::ContextMenuBehavior
#
# @ui_component Context Menu
# @ui_description ContextMenu - Phlex implementation
# @ui_category overlay
#
# @ui_anatomy Context Menu - Container for context menus triggered by right-click. (required)
# @ui_anatomy Content - Menu items container with animations and positioning. (required)
# @ui_anatomy Item - Individual menu item that can be rendered as a link or div.
# @ui_anatomy Label - Non-interactive label for grouping menu items.
# @ui_anatomy Separator - A visual divider between menu items.
# @ui_anatomy Shortcut - Displays keyboard shortcut text for a menu item.
# @ui_anatomy Trigger - The element that triggers the context menu on right-click. (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Keyboard navigation with arrow keys
# @ui_feature Click outside to close
#
# @ui_aria_pattern Menu
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/menu/
#
# @ui_keyboard Enter Activates the focused element
# @ui_keyboard Escape Closes the component
# @ui_keyboard ArrowDown Moves focus to next item
# @ui_keyboard ArrowUp Moves focus to previous item
# @ui_keyboard Home Moves focus to first item
# @ui_keyboard End Moves focus to last item
#
# @ui_related dropdown_menu
# @ui_related menubar
#
module UI::ContextMenuBehavior
  # Returns HTML attributes for the context menu container
  def context_menu_html_attributes
    {
      class: context_menu_classes,
      data: context_menu_data_attributes
    }
  end

  # Returns combined CSS classes for the context menu
  def context_menu_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      "relative inline-block",
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for Stimulus controller
  def context_menu_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    (attributes_value&.fetch(:data, {}) || {}).merge({
      controller: "ui--context-menu"
    })
  end
end
