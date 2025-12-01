# frozen_string_literal: true

# RadioGroup - Phlex implementation
#
# Container for radio items in the menu.
#
# @example Basic usage
#   render UI::RadioGroup.new(value: "option1") do
#     render UI::RadioItem.new(value: "option1", checked: true) { "Option 1" }
#     render UI::RadioItem.new(value: "option2") { "Option 2" }
#   end
class UI::MenubarRadioGroup < Phlex::HTML
  include UI::MenubarRadioGroupBehavior

  # @param value [String] Currently selected value
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(value: nil, classes: "", **attributes)
    @value = value
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**menubar_radio_group_html_attributes.deep_merge(@attributes)) do
      yield if block_given?
    end
  end
end
