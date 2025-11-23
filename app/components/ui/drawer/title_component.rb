# frozen_string_literal: true

module UI
  module Drawer
    # Drawer title component (ViewComponent)
    # ARIA-compliant heading for drawer
    #
    # @example
    #   <%= render UI::Drawer::TitleComponent.new { "Drawer Title" } %>
    class TitleComponent < ViewComponent::Base
      include UI::Drawer::DrawerTitleBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {})
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **drawer_title_html_attributes.merge(@attributes)
      end
    end
  end
end
