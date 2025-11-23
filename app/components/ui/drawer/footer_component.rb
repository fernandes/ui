# frozen_string_literal: true

module UI
  module Drawer
    # Drawer footer component (ViewComponent)
    # Action area for drawer (buttons, etc.)
    #
    # @example
    #   <%= render UI::Drawer::FooterComponent.new do %>
    #     <%= render UI::Button::ButtonComponent.new { "Submit" } %>
    #     <%= render UI::Drawer::CloseComponent.new { "Cancel" } %>
    #   <% end %>
    class FooterComponent < ViewComponent::Base
      include UI::Drawer::DrawerFooterBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {})
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **drawer_footer_html_attributes.merge(@attributes)
      end
    end
  end
end
