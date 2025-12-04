# frozen_string_literal: true

# SliderThumb - Phlex implementation
#
# The thumb is the draggable handle that controls the slider value.
# Uses SliderThumbBehavior module for shared logic.
#
# @example Basic usage
#   render UI::Slider.new(default_value: [50]) do
#     render UI::SliderTrack.new do
#       render UI::SliderRange.new
#     end
#     render UI::SliderThumb.new
#   end
#
# @example Range slider with two thumbs
#   render UI::Slider.new(default_value: [25, 75]) do
#     render UI::SliderTrack.new do
#       render UI::SliderRange.new
#     end
#     render UI::SliderThumb.new
#     render UI::SliderThumb.new
#   end
class UI::SliderThumb < Phlex::HTML
  include UI::SliderThumbBehavior

  # @param disabled [Boolean] Whether the thumb is disabled
  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(disabled: false, classes: "", attributes: {})
    @disabled = disabled
    @classes = classes
    @attributes = attributes
  end

  def view_template
    all_attributes = slider_thumb_html_attributes

    # Merge data attributes
    all_attributes[:data] = all_attributes[:data].merge(@attributes.fetch(:data, {}))

    # Merge with user attributes (except data which we already handled)
    all_attributes = all_attributes.merge(@attributes.except(:data))

    div(**all_attributes)
  end
end
