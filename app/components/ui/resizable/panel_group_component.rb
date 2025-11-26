# frozen_string_literal: true

module UI
  module Resizable
    # ResizablePanelGroup container component (ViewComponent)
    # Wraps resizable panels with Stimulus controller
    #
    # @example Basic horizontal layout
    #   <%= render UI::Resizable::PanelGroupComponent.new(direction: "horizontal") do %>
    #     <%= render UI::Resizable::PanelComponent.new(default_size: 50) do %>
    #       Left panel content
    #     <% end %>
    #     <%= render UI::Resizable::HandleComponent.new %>
    #     <%= render UI::Resizable::PanelComponent.new(default_size: 50) do %>
    #       Right panel content
    #     <% end %>
    #   <% end %>
    #
    # @example Vertical layout
    #   <%= render UI::Resizable::PanelGroupComponent.new(direction: "vertical") do %>
    #     <%= render UI::Resizable::PanelComponent.new(default_size: 30) { "Top" } %>
    #     <%= render UI::Resizable::HandleComponent.new %>
    #     <%= render UI::Resizable::PanelComponent.new(default_size: 70) { "Bottom" } %>
    #   <% end %>
    class PanelGroupComponent < ViewComponent::Base
      include UI::Resizable::PanelGroupBehavior

      # @param direction [String] "horizontal" or "vertical" layout
      # @param keyboard_resize_by [Integer] percentage to resize by on keyboard input
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(direction: "horizontal", keyboard_resize_by: 10, classes: "", attributes: {})
        @direction = direction
        @keyboard_resize_by = keyboard_resize_by
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = panel_group_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
