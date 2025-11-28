# frozen_string_literal: true

    # Drawer description component (ViewComponent)
    # ARIA-compliant description for drawer
    #
    # @example
    #   <%= render UI::DescriptionComponent.new { "Drawer description text" } %>
    class UI::DrawerDescriptionComponent < ViewComponent::Base
      include UI::DrawerDescriptionBehavior

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
