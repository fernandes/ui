# frozen_string_literal: true

# Slider - Phlex implementation
#
# A range slider component for selecting values within a range.
# Uses SliderBehavior module for shared logic.
#
# @example Basic usage
#   render UI::Slider.new(default_value: [50], max: 100) do
#     render UI::SliderTrack.new do
#       render UI::SliderRange.new
#     end
#     render UI::SliderThumb.new
#   end
#
# @example Range slider with two thumbs
#   render UI::Slider.new(default_value: [25, 75], max: 100) do
#     render UI::SliderTrack.new do
#       render UI::SliderRange.new
#     end
#     render UI::SliderThumb.new
#     render UI::SliderThumb.new
#   end
class UI::Slider < Phlex::HTML
  include UI::SliderBehavior

  # @param min [Integer] Minimum value
  # @param max [Integer] Maximum value
  # @param step [Integer] Step increment
  # @param value [Array] Current value (controlled)
  # @param default_value [Array] Initial value (uncontrolled)
  # @param center_point [Integer] Center point for bidirectional sliders
  # @param disabled [Boolean] Whether the slider is disabled
  # @param orientation [String] Orientation (horizontal, vertical)
  # @param inverted [Boolean] Whether the slider is inverted
  # @param name [String] Form field name
  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(
    min: 0,
    max: 100,
    step: 1,
    value: nil,
    default_value: nil,
    center_point: nil,
    disabled: false,
    orientation: "horizontal",
    inverted: false,
    name: "",
    classes: "",
    attributes: {}
  )
    @min = min
    @max = max
    @step = step
    @value = value
    @center_point = center_point
    @default_value = default_value || (center_point ? [center_point] : [min])
    @disabled = disabled
    @orientation = orientation
    @inverted = inverted
    @name = name
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    all_attributes = slider_html_attributes

    # Merge data attributes
    all_attributes[:data] = all_attributes[:data].merge(@attributes.fetch(:data, {}))

    # Merge with user attributes (except data which we already handled)
    all_attributes = all_attributes.merge(@attributes.except(:data))

    div(**all_attributes) do
      yield if block_given?
    end
  end
end
