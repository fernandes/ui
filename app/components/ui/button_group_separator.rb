# frozen_string_literal: true

    # Separator - Phlex implementation
    #
    # Visually divides buttons within a button group.
    # Extends UI::Separator with button group specific styling.
    #
    # Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
    #
    # @example Basic separator
    #   render UI::ButtonGroup.new do
    #     render UI::Button.new(variant: :secondary) { "Copy" }
    #     render UI::Separator.new
    #     render UI::Button.new(variant: :secondary) { "Paste" }
    #   end
    class UI::ButtonGroupSeparator < UI::Separator
      include UI::SeparatorBehavior

      # @param orientation [Symbol, String] Direction of the separator (:horizontal, :vertical)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(orientation: :vertical, decorative: true, classes: "", **attributes)
        @orientation = orientation
        @decorative = decorative
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**separator_html_attributes.deep_merge(@attributes))
      end
    end
