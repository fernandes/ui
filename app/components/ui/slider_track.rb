# frozen_string_literal: true

# SliderTrack - Phlex implementation
#
# The track is the background rail that contains the range.
# Uses SliderTrackBehavior module for shared logic.
#
# @example Basic usage
#   render UI::SliderTrack.new do
#     render UI::SliderRange.new
#   end
class UI::SliderTrack < Phlex::HTML
  include UI::SliderTrackBehavior

  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", attributes: {})
    @classes = classes
    @attributes = attributes
  end

  def view_template(&block)
    all_attributes = slider_track_html_attributes

    # Merge data attributes
    all_attributes[:data] = all_attributes[:data].merge(@attributes.fetch(:data, {}))

    # Merge with user attributes (except data which we already handled)
    all_attributes = all_attributes.merge(@attributes.except(:data))

    div(**all_attributes) do
      yield if block_given?
    end
  end
end
