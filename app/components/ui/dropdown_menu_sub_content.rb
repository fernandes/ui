# frozen_string_literal: true

# SubContent - Phlex implementation
#
# Submenu items container positioned to the right of the trigger.
# Uses DropdownMenuSubContentBehavior concern for shared styling logic.
#
# @example Submenu content
#   render UI::SubContent.new do
#     render UI::Item.new { "Submenu Item" }
#   end
class UI::DropdownMenuSubContent < Phlex::HTML
  include UI::DropdownMenuSubContentBehavior

  # @param side [String] Side to position submenu ("right", "left", "top", "bottom")
  # @param align [String] Alignment relative to trigger ("start", "center", "end")
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(side: "right", align: "start", classes: "", **attributes)
    @side = side
    @align = align
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**dropdown_menu_sub_content_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
    end
  end
end
