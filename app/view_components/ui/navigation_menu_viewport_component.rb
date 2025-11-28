# frozen_string_literal: true

    # ViewportComponent - ViewComponent implementation
    #
    # Container for navigation menu content when viewport mode is enabled.
    class UI::NavigationMenuViewportComponent < ViewComponent::Base
      include UI::ViewportBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **navigation_menu_viewport_wrapper_html_attributes do
          content_tag :div, nil, **navigation_menu_viewport_html_attributes.deep_merge(@attributes)
        end
      end
    end
