# frozen_string_literal: true

module UI
  module Slider
    # Slider Range component (ViewComponent)
    # Filled portion of the track showing the selected value
    #
    # @example Basic usage (must be inside SliderTrack)
    #   <%= render UI::Slider::SliderRangeComponent.new %>
    class SliderRangeComponent < ViewComponent::Base
      include UI::Slider::SliderRangeBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {})
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = slider_range_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, "", **attrs.merge(@attributes.except(:data))
      end
    end
  end
end
