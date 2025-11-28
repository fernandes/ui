# frozen_string_literal: true

    # Drawer content component (ViewComponent)
    # Main draggable panel with direction support
    #
    # @example
    #   <%= render UI::ContentComponent.new(direction: "bottom") do %>
    #     <!-- Drawer content -->
    #   <% end %>
    class UI::DrawerContentComponent < ViewComponent::Base
      include UI::DrawerContentBehavior

      # @param open [Boolean] whether the drawer is open
      # @param direction [String] drawer position: "bottom", "top", "left", "right"
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(open: false, direction: "bottom", classes: "", attributes: {})
        @open = open
        @direction = direction
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = drawer_content_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, class: "group/drawer-content", **attrs.merge(@attributes.except(:data)) do
          content
        end
      end
    end
