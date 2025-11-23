# frozen_string_literal: true

module UI
  module Tabs
    # TabsContent component (ViewComponent)
    # Panel displaying content for active tab
    #
    # @example Basic usage
    #   <%= render UI::Tabs::TabsContentComponent.new(value: "account") do %>
    #     Account settings content
    #   <% end %>
    class TabsContentComponent < ViewComponent::Base
      include UI::Tabs::TabsContentBehavior

      # @param value [String] unique identifier for this content panel
      # @param default_value [String] currently active tab value
      # @param orientation [String] "horizontal" or "vertical"
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(value: "", default_value: "", orientation: "horizontal", classes: "", attributes: {})
        @value = value
        @default_value = default_value
        @orientation = orientation
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = content_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
