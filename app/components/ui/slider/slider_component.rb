# frozen_string_literal: true

module UI
  module Slider
    # Slider container component (ViewComponent)
    # Root component for range slider with keyboard navigation
    #
    # @example Basic usage
    #   <%= render UI::Slider::SliderComponent.new(default_value: [50], max: 100, step: 1) do %>
    #     <%= render UI::Slider::SliderTrackComponent.new do %>
    #       <%= render UI::Slider::SliderRangeComponent.new %>
    #     <% end %>
    #     <%= render UI::Slider::SliderThumbComponent.new %>
    #   <% end %>
    #
    # @example With multiple thumbs (range)
    #   <%= render UI::Slider::SliderComponent.new(default_value: [25, 75], max: 100) do %>
    #     <%= render UI::Slider::SliderTrackComponent.new do %>
    #       <%= render UI::Slider::SliderRangeComponent.new %>
    #     <% end %>
    #     <%= render UI::Slider::SliderThumbComponent.new %>
    #     <%= render UI::Slider::SliderThumbComponent.new %>
    #   <% end %>
    class SliderComponent < ViewComponent::Base
      include UI::Slider::SliderBehavior

      # @param min [Integer] minimum value (default: 0)
      # @param max [Integer] maximum value (default: 100)
      # @param step [Integer] step increment (default: 1)
      # @param value [Array<Integer>] controlled value
      # @param default_value [Array<Integer>] default value (default: [min])
      # @param disabled [Boolean] whether slider is disabled
      # @param orientation [String] "horizontal" or "vertical" (default: "horizontal")
      # @param inverted [Boolean] whether to invert the slider direction
      # @param name [String] form input name
      # @param center_point [Integer, nil] center point for bidirectional sliders (e.g., 0 for balance)
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(min: 0, max: 100, step: 1, value: nil, default_value: nil, disabled: false, orientation: "horizontal", inverted: false, name: "", center_point: nil, classes: "", attributes: {})
        @min = min
        @max = max
        @step = step
        @value = value
        @center_point = center_point
        # If center_point is defined and no default_value provided, start at center
        @default_value = default_value || (center_point ? [center_point] : [min])
        @disabled = disabled
        @orientation = orientation
        @inverted = inverted
        @name = name
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = slider_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
