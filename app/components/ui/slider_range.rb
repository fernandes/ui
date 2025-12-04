# frozen_string_literal: true

# SliderRange - Phlex implementation
#
# The range is the filled portion of the track showing the selected value.
# Uses SliderRangeBehavior module for shared logic.
#
# @example Basic usage (inside SliderTrack)
#   render UI::SliderTrack.new do
#     render UI::SliderRange.new
#   end
class UI::SliderRange < Phlex::HTML
  include UI::SliderRangeBehavior

  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", attributes: {})
    @classes = classes
    @attributes = attributes
  end

  def view_template
    all_attributes = slider_range_html_attributes

    # Merge data attributes
    all_attributes[:data] = all_attributes[:data].merge(@attributes.fetch(:data, {}))

    # Merge with user attributes (except data which we already handled)
    all_attributes = all_attributes.merge(@attributes.except(:data))

    div(**all_attributes)
  end
end
