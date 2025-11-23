# frozen_string_literal: true

module UI
  module Drawer
    # Drawer trigger component (ViewComponent)
    # Opens the drawer on click
    #
    # @example As button (default)
    #   <%= render UI::Drawer::TriggerComponent.new { "Open Drawer" } %>
    #
    # @example As child (composition pattern)
    #   <%= render UI::Drawer::TriggerComponent.new(as_child: true) do |attrs| %>
    #     <%= render UI::Button::ButtonComponent.new(**attrs) { "Open" } %>
    #   <% end %>
    class TriggerComponent < ViewComponent::Base
      include UI::Drawer::DrawerTriggerBehavior

      # @param as_child [Boolean] yield attributes to block instead of rendering button
      # @param attributes [Hash] additional HTML attributes
      def initialize(as_child: false, attributes: {})
        @as_child = as_child
        @attributes = attributes
      end

      def call
        trigger_attrs = drawer_trigger_html_attributes

        if @as_child
          # Yield attributes to block - child must accept and use them
          content.call(trigger_attrs) if content.respond_to?(:call)
        else
          # Default: render as button
          content_tag :button, content, **trigger_attrs
        end
      end
    end
  end
end
