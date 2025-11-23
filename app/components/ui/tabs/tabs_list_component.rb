# frozen_string_literal: true

module UI
  module Tabs
    # TabsList component (ViewComponent)
    # Container for tab trigger buttons
    #
    # @example Basic usage
    #   <%= render UI::Tabs::TabsListComponent.new do %>
    #     <%= render UI::Tabs::TabsTriggerComponent.new(value: "tab1") { "Tab 1" } %>
    #     <%= render UI::Tabs::TabsTriggerComponent.new(value: "tab2") { "Tab 2" } %>
    #   <% end %>
    class TabsListComponent < ViewComponent::Base
      include UI::Tabs::TabsListBehavior

      # @param orientation [String] "horizontal" or "vertical"
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(orientation: "horizontal", classes: "", attributes: {})
        @orientation = orientation
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = list_html_attributes

        content_tag :div, **attrs.merge(@attributes) do
          content
        end
      end
    end
  end
end
