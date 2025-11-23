# frozen_string_literal: true

module UI
  module Drawer
    # Drawer description component (ViewComponent)
    # ARIA-compliant description for drawer
    #
    # @example
    #   <%= render UI::Drawer::DescriptionComponent.new { "Drawer description text" } %>
    class DescriptionComponent < ViewComponent::Base
      include UI::Drawer::DrawerDescriptionBehavior

      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(classes: "", attributes: {})
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :p, content, **drawer_description_html_attributes.merge(@attributes)
      end
    end
  end
end
