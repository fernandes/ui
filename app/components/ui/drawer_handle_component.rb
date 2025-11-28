# frozen_string_literal: true

    # Drawer handle component (ViewComponent)
    # Visual affordance for drag gesture (shown on bottom/top drawers only)
    #
    # @example
    #   <%= render UI::HandleComponent.new %>
    class UI::DrawerHandleComponent < ViewComponent::Base
      include UI::DrawerHandleBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {})
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = drawer_handle_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, "", **attrs.merge(@attributes.except(:data))
      end
    end
