# frozen_string_literal: true

# Slider Track component (ViewComponent)
# Background rail that contains the range
#
# @example Basic usage
#   <%= render UI::SliderTrackComponent.new do %>
#     <%= render UI::SliderRangeComponent.new %>
#   <% end %>
class UI::SliderTrackComponent < ViewComponent::Base
  include UI::SliderTrackBehavior

  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(classes: "", attributes: {})
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = slider_track_html_attributes
    attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

    content_tag :div, **attrs.merge(@attributes.except(:data)) do
      content
    end
  end
end
