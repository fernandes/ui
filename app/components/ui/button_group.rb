# frozen_string_literal: true

    # ButtonGroup - Phlex implementation
    #
    # A container that groups related buttons together with consistent styling.
    # Uses ButtonGroupBehavior module for shared styling logic.
    #
    # Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
    #
    # @example Horizontal button group (default)
    #   render UI::ButtonGroup.new do
    #     render UI::Button.new(variant: :outline) { "Button 1" }
    #     render UI::Button.new(variant: :outline) { "Button 2" }
    #   end
    #
    # @example Vertical button group
    #   render UI::ButtonGroup.new(orientation: :vertical) do
    #     render UI::Button.new(variant: :outline, size: :icon) { "+" }
    #     render UI::Button.new(variant: :outline, size: :icon) { "-" }
    #   end
    #
    # @example Nested button groups
    #   render UI::ButtonGroup.new do
    #     render UI::ButtonGroup.new do
    #       render UI::Button.new(variant: :outline) { "1" }
    #       render UI::Button.new(variant: :outline) { "2" }
    #     end
    #     render UI::ButtonGroup.new do
    #       render UI::Button.new(variant: :outline) { "Previous" }
    #       render UI::Button.new(variant: :outline) { "Next" }
    #     end
    #   end
    class UI::ButtonGroup < Phlex::HTML
      include UI::ButtonGroupBehavior

      # @param orientation [Symbol, String] Direction of the button group (:horizontal, :vertical)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(orientation: :horizontal, classes: "", **attributes)
        @orientation = orientation
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**button_group_html_attributes.deep_merge(@attributes), &block)
      end
    end
