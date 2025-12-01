# frozen_string_literal: true

# UI::MenubarMenuBehavior
#
# @ui_component Menubar Menu
# @ui_description Menu - Phlex implementation
# @ui_category other
#
# @ui_anatomy Menubar Menu - Wrapper for each top-level menu in the menubar. (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::MenubarMenuBehavior
  # Returns HTML attributes for the menu wrapper
  def menubar_menu_html_attributes
    {
      class: menubar_menu_classes,
      data: menubar_menu_data_attributes
    }
  end

  # Returns combined CSS classes for the menu wrapper
  def menubar_menu_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      "relative",
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for Stimulus target
  def menubar_menu_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    base_data = {
      "ui--menubar-target": "menu"
    }

    # Add value if provided (used to identify which menu is open)
    base_data[:"ui--menubar-value"] = @value if defined?(@value) && @value

    (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
  end
end
