# frozen_string_literal: true

    # SelectComponent - ViewComponent implementation
    #
    # A custom select component with keyboard navigation, scrollable viewport, and form integration.
    # Root container that wraps trigger, content, and items.
    #
    # @example Basic usage
    #   <%= render UI::SelectComponent.new(value: "apple") do %>
    #     <%= render UI::TriggerComponent.new(placeholder: "Select a fruit...") %>
    #     <%= render UI::ContentComponent.new do %>
    #       <%= render UI::ItemComponent.new(value: "apple") { "Apple" } %>
    #       <%= render UI::ItemComponent.new(value: "banana") { "Banana" } %>
    #     <% end %>
    #   <% end %>
    class UI::SelectComponent < ViewComponent::Base
      include UI::SelectBehavior

      # @param value [String] Currently selected value
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(value: nil, classes: "", **attributes)
        @value = value
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **select_html_attributes.deep_merge(@attributes)
      end
    end
