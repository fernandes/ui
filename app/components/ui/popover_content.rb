# frozen_string_literal: true

    # Content - Phlex implementation
    #
    # The floating content panel.
    # Uses PopoverContentBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Content.new do
    #     plain "Popover content here"
    #   end
    class UI::PopoverContent < Phlex::HTML
      include UI::PopoverContentBehavior

      # @param side [String] Side of the trigger to show the content ("top", "bottom", "left", "right")
      # @param align [String] Alignment relative to the trigger ("start", "center", "end")
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(side: "bottom", align: "center", classes: "", **attributes)
        @side = side
        @align = align
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**popover_content_html_attributes, &block)
      end
    end
