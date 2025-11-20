# frozen_string_literal: true

module UI
  module Select
    # SelectComponent - ViewComponent implementation
    #
    # A custom select component with keyboard navigation, scrollable viewport, and form integration.
    # Root container that wraps trigger, content, and items.
    #
    # @example Basic usage
    #   <%= render UI::Select::SelectComponent.new(value: "apple") do %>
    #     <%= render UI::Select::TriggerComponent.new(placeholder: "Select a fruit...") %>
    #     <%= render UI::Select::ContentComponent.new do %>
    #       <%= render UI::Select::ItemComponent.new(value: "apple") { "Apple" } %>
    #       <%= render UI::Select::ItemComponent.new(value: "banana") { "Banana" } %>
    #     <% end %>
    #   <% end %>
    class SelectComponent < ViewComponent::Base
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
  end
end
