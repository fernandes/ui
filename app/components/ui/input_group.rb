# frozen_string_literal: true

# InputGroup - Phlex implementation
#
# A wrapper component for grouping inputs with addons, buttons, and text.
# Uses InputGroupBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::InputGroup.new do
#     render UI::Input.new(placeholder: "Enter text")
#   end
#
# @example With addons
#   render UI::InputGroup.new do
#     render UI::Addon.new(align: "inline-start") { "@" }
#     render UI::Input.new(placeholder: "username")
#   end
class UI::InputGroup < Phlex::HTML
  include UI::InputGroupBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**input_group_html_attributes) do
      yield if block_given?
    end
  end
end
