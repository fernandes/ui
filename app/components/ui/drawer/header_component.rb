# frozen_string_literal: true

module UI
  module Drawer
    # Drawer header component (ViewComponent)
    # Header section for drawer
    #
    # @example
    #   <%= render UI::Drawer::HeaderComponent.new do %>
    #     <%= render UI::Drawer::TitleComponent.new { "Title" } %>
    #     <%= render UI::Drawer::DescriptionComponent.new { "Description" } %>
    #   <% end %>
    class HeaderComponent < ViewComponent::Base
      include UI::Drawer::DrawerHeaderBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {})
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **drawer_header_html_attributes.merge(@attributes)
      end
    end
  end
end
