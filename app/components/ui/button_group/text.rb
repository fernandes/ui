# frozen_string_literal: true

module UI
  module ButtonGroup
    # Text - Phlex implementation
    #
    # Displays text within a button group.
    # Uses TextBehavior module for shared styling logic.
    # Supports asChild pattern for rendering custom components.
    #
    # Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
    #
    # @example Basic text
    #   render UI::ButtonGroup::ButtonGroup.new do
    #     render UI::ButtonGroup::Text.new { "Label" }
    #     render UI::Button::Button.new(variant: :outline) { "Button" }
    #   end
    #
    # @example With asChild (render as label)
    #   render UI::ButtonGroup::ButtonGroup.new do
    #     render UI::ButtonGroup::Text.new(as_child: true) do |attrs|
    #       label(**attrs, for: "name") { "Name" }
    #     end
    #     input(type: "text", id: "name")
    #   end
    class Text < Phlex::HTML
      include UI::ButtonGroup::TextBehavior

      # @param as_child [Boolean] Whether to yield attributes to a child component
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, classes: "", **attributes)
        @as_child = as_child
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        if @as_child
          # Yield attributes to the block for custom rendering
          yield(text_html_attributes.deep_merge(@attributes))
        else
          # Render as a div
          div(**text_html_attributes.deep_merge(@attributes), &block)
        end
      end
    end
  end
end
