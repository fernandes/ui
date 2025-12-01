# frozen_string_literal: true

# Field - Phlex implementation
#
# Core wrapper for a single form field with support for different orientations.
# Uses FieldBehavior concern for shared styling logic.
#
# @example Basic usage
#   render UI::Field.new { "Field content here" }
#
# @example With orientation
#   render UI::Field.new(orientation: "horizontal") { "Field content" }
#
# @example With validation state
#   render UI::Field.new(data_invalid: true) { "Field content" }
class UI::Field < Phlex::HTML
  include UI::FieldBehavior

  # @param orientation [String] Layout orientation: "vertical", "horizontal", or "responsive"
  # @param data_invalid [Boolean] Whether field is in invalid state
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(orientation: "vertical", data_invalid: nil, classes: "", **attributes)
    @orientation = orientation
    @data_invalid = data_invalid
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    div(**field_html_attributes) do
      yield if block_given?
    end
  end
end
