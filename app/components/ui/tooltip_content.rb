# frozen_string_literal: true

    # Content - Phlex implementation
    #
    # The popup content that displays tooltip information.
    # Positioned by Floating UI via Stimulus controller.
    #
    # @example Basic usage
    #   render UI::Content.new { "Tooltip text" }
    #
    # @example With custom side
    #   render UI::Content.new(side: "right") { "Appears on right" }
    #
    # @example With side offset
    #   render UI::Content.new(side_offset: 8) { "More spacing" }
    class UI::TooltipContent < Phlex::HTML
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

      def view_template(&block)
        div(**tooltip_content_html_attributes.deep_merge(@attributes), &block)
      end
    end
