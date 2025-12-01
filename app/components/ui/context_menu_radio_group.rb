# frozen_string_literal: true

# RadioGroup - Phlex implementation
#
# Container for radio menu items.
# Uses ContextMenuRadioGroupBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::RadioGroup.new do
#     render UI::RadioItem.new(checked: true) { "Option 1" }
#     render UI::RadioItem.new { "Option 2" }
#   end
class UI::ContextMenuRadioGroup < Phlex::HTML
  include UI::ContextMenuRadioGroupBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**context_menu_radio_group_html_attributes.merge(@attributes)) do
      yield if block_given?
    end
  end
end
