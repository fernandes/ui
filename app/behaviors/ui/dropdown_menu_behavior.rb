# frozen_string_literal: true

# UI::DropdownMenuBehavior
#
# @ui_component Dropdown Menu
# @ui_description DropdownMenu - Phlex implementation
# @ui_category overlay
#
# @ui_anatomy Dropdown Menu - Container for dropdown menus with Stimulus controller for interactivity. (required)
# @ui_anatomy Content - Menu items container with animations and positioning. (required)
# @ui_anatomy Item - Individual menu item that can be rendered as a link or div.
# @ui_anatomy Label - Label for menu sections to organize items.
# @ui_anatomy Separator - Visual separator between menu items.
# @ui_anatomy Shortcut - Keyboard shortcut indicator displayed at the end of menu items.
# @ui_anatomy Sub - Container for submenu with relative positioning.
# @ui_anatomy Sub Content - Submenu items container positioned to the right of the trigger. (required)
# @ui_anatomy Sub Trigger - Item that opens a submenu on hover. (required)
# @ui_anatomy Trigger - Wrapper that adds toggle action to child element. (required)
#
# @ui_feature Custom styling with Tailwind classes
#
# @ui_aria_pattern Menu Button
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
#
# @ui_related context_menu
# @ui_related menubar
# @ui_related select
#
module UI::DropdownMenuBehavior
  # Returns HTML attributes for the dropdown menu container
  # When used with asChild, these attributes will be yielded to the child
  def dropdown_menu_html_attributes
    attrs = {
      data: dropdown_menu_data_attributes
    }

    # Only add container classes if not using asChild
    # When asChild is true, we don't render a wrapper
    unless @as_child
      attrs[:class] = dropdown_menu_classes
    end

    attrs
  end

  # Returns combined CSS classes for the dropdown menu
  def dropdown_menu_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      "relative inline-block text-left",
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for Stimulus controller
  def dropdown_menu_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    (attributes_value&.fetch(:data, {}) || {}).merge({
      controller: "ui--dropdown",
      "ui--dropdown-placement-value": @placement,
      "ui--dropdown-offset-value": @offset,
      "ui--dropdown-flip-value": @flip
    })
  end
end
