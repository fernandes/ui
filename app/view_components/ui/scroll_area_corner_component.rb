# frozen_string_literal: true

    # CornerComponent - ViewComponent implementation
    #
    # Intersection element between vertical and horizontal scrollbars.
    #
    # @example Default usage (automatically used by ScrollAreaComponent)
    #   <%= render UI::CornerComponent.new %>
    class UI::ScrollAreaCornerComponent < ViewComponent::Base
      include UI::ScrollAreaCornerBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, nil, **scroll_area_corner_html_attributes.deep_merge(@attributes)
      end
    end
