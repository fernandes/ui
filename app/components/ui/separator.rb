# frozen_string_literal: true

    # Separator - Phlex implementation
    #
    # Visually or semantically separates content.
    # Uses SeparatorBehavior module for shared styling logic.
    #
    # Based on shadcn/ui Separator: https://ui.shadcn.com/docs/components/separator
    # Based on Radix UI Separator: https://www.radix-ui.com/primitives/docs/components/separator
    #
    # @example Horizontal separator (default)
    #   render UI::Separator.new
    #
    # @example Vertical separator
    #   render UI::Separator.new(orientation: :vertical)
    #
    # @example Semantic separator (for screen readers)
    #   render UI::Separator.new(decorative: false)
    #
    # @example With custom classes
    #   render UI::Separator.new(classes: "my-4")
    class UI::Separator < Phlex::HTML
      include UI::SeparatorBehavior

      # @param orientation [Symbol, String] Direction of the separator (:horizontal, :vertical)
      # @param decorative [Boolean] Whether the separator is purely decorative (true) or has semantic meaning (false)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(orientation: :horizontal, decorative: true, classes: "", **attributes)
        @orientation = orientation
        @decorative = decorative
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**separator_html_attributes.deep_merge(@attributes))
      end
    end
