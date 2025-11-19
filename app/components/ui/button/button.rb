# frozen_string_literal: true

module UI
  module Button
    # Button - Phlex implementation
    #
    # A versatile button component with multiple variants and sizes.
    # Uses ButtonBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Button::Button.new { "Click me" }
    #
    # @example With variant and size
    #   render UI::Button::Button.new(variant: "destructive", size: "lg") { "Delete" }
    #
    # @example Disabled state
    #   render UI::Button::Button.new(disabled: true) { "Disabled" }
    class Button < Phlex::HTML
      include UI::ButtonBehavior

      # @param variant [String] Visual style variant (default, destructive, outline, secondary, ghost, link)
      # @param size [String] Size variant (default, sm, lg, icon, icon-sm, icon-lg)
      # @param type [String] Button type attribute (button, submit, reset)
      # @param disabled [Boolean] Whether the button is disabled
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: "default", size: "default", type: "button", disabled: false, classes: "", **attributes)
        @variant = variant
        @size = size
        @type = type
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        button(**button_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
