# frozen_string_literal: true

# Separator - Phlex implementation
#
# Visual separator between menu items.
# Uses DropdownMenuSeparatorBehavior concern for shared styling logic.
#
# @example Basic separator
#   render UI::Separator.new
class UI::DropdownMenuSeparator < Phlex::HTML
  include UI::DropdownMenuSeparatorBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template
    div(**dropdown_menu_separator_html_attributes.deep_merge(@attributes))
  end
end
