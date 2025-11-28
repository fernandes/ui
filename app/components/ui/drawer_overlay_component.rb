# frozen_string_literal: true

    # Drawer overlay component (ViewComponent)
    # Backdrop with fade animation
    #
    # @example
    #   <%= render UI::OverlayComponent.new(open: false) %>
    class UI::DrawerOverlayComponent < ViewComponent::Base
      include UI::DrawerOverlayBehavior

      # @param open [Boolean] whether the drawer is open
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(open: false, classes: "", attributes: {})
        @open = open
        @classes = classes
        @attributes = attributes
      end

      def call
        container_attrs = drawer_overlay_container_html_attributes
        container_attrs[:data] = container_attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **container_attrs.merge(@attributes.except(:data)) do
          content_tag :div, "", **drawer_overlay_html_attributes
        end
      end
    end
