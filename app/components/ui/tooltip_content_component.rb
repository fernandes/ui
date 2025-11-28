# frozen_string_literal: true

    # ContentComponent - ViewComponent implementation
    #
    # The popup content that displays tooltip information.
    # Positioned by Floating UI via Stimulus controller.
    class UI::TooltipContentComponent < ViewComponent::Base
      include UI::TooltipContentBehavior

      # @param side [String] Preferred side: "top", "right", "bottom", "left"
      # @param align [String] Alignment: "start", "center", "end"
      # @param side_offset [Integer] Distance from trigger element in pixels
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(side: "top", align: "center", side_offset: 4, classes: "", **attributes)
        @side = side
        @align = align
        @side_offset = side_offset
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **tooltip_content_html_attributes.merge(@attributes.except(:data)) do
          content
        end
      end
    end
