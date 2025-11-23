# frozen_string_literal: true

module UI
  module Tabs
    # Tabs container component (ViewComponent)
    # Root component for tabbed interface with keyboard navigation
    #
    # @example Basic usage
    #   <%= render UI::Tabs::TabsComponent.new(default_value: "account") do %>
    #     <%= render UI::Tabs::TabsListComponent.new do %>
    #       <%= render UI::Tabs::TabsTriggerComponent.new(value: "account") { "Account" } %>
    #       <%= render UI::Tabs::TabsTriggerComponent.new(value: "password") { "Password" } %>
    #     <% end %>
    #     <%= render UI::Tabs::TabsContentComponent.new(value: "account") { "Account content" } %>
    #     <%= render UI::Tabs::TabsContentComponent.new(value: "password") { "Password content" } %>
    #   <% end %>
    class TabsComponent < ViewComponent::Base
      include UI::Tabs::TabsBehavior

      # @param default_value [String] initial active tab value
      # @param orientation [String] "horizontal" or "vertical"
      # @param activation_mode [String] "automatic" or "manual"
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(default_value: "", orientation: "horizontal", activation_mode: "automatic", classes: "", attributes: {})
        @default_value = default_value
        @orientation = orientation
        @activation_mode = activation_mode
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = tabs_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)) do
          content
        end
      end
    end
  end
end
