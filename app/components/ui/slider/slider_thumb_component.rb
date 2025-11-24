# frozen_string_literal: true

module UI
  module Slider
    # Slider Thumb component (ViewComponent)
    # Draggable handle that controls the slider value
    #
    # @example Basic usage (single thumb)
    #   <%= render UI::Slider::SliderThumbComponent.new %>
    #
    # @example Multiple thumbs (range)
    #   <%= render UI::Slider::SliderThumbComponent.new %>
    #   <%= render UI::Slider::SliderThumbComponent.new %>
    class SliderThumbComponent < ViewComponent::Base
      include UI::Slider::SliderThumbBehavior

      # @param disabled [Boolean] whether thumb is disabled
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(disabled: false, classes: "", attributes: {})
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = slider_thumb_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, "", **attrs.merge(@attributes.except(:data))
      end
    end
  end
end
