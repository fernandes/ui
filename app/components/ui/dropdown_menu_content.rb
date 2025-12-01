# frozen_string_literal: true

# Content - Phlex implementation
#
# Menu items container with animations and positioning.
# Uses DropdownMenuContentBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::Content.new do
#     render UI::Item.new { "Menu Item" }
#   end
class UI::DropdownMenuContent < Phlex::HTML
  include UI::DropdownMenuContentBehavior

  # @param side_offset [Integer] Offset from trigger side
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(side_offset: 4, classes: "", **attributes)
    @side_offset = side_offset
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**dropdown_menu_content_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
    end
  end
end
