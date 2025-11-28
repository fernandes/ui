# frozen_string_literal: true

    # Drawer footer component (ViewComponent)
    # Action area for drawer (buttons, etc.)
    #
    # @example
    #   <%= render UI::FooterComponent.new do %>
    #     <%= render UI::ButtonComponent.new { "Submit" } %>
    #     <%= render UI::CloseComponent.new { "Cancel" } %>
    #   <% end %>
    class UI::DrawerFooterComponent < ViewComponent::Base
      include UI::DrawerFooterBehavior

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
