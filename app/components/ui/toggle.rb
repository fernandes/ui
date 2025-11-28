# frozen_string_literal: true

    # Toggle - Phlex implementation
    #
    # A two-state button that can be either on or off.
    # Uses ToggleBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Toggle.new { "Toggle" }
    #
    # @example With icon
    #   render UI::Toggle.new(variant: "outline", pressed: true) do
    #     render Icon.new("bookmark")
    #   end
    #
    # @example Disabled state
    #   render UI::Toggle.new(disabled: true) { "Disabled" }
    class UI::Toggle < Phlex::HTML
      include UI::ToggleBehavior

      # @param variant [String] Visual style variant (default, outline)
      # @param size [String] Size variant (default, sm, lg)
      # @param type [String] Button type attribute (button, submit, reset)
      # @param pressed [Boolean] Whether the toggle is pressed/active
      # @param disabled [Boolean] Whether the toggle is disabled
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: "default", size: "default", type: "button", pressed: false, disabled: false, classes: "", **attributes)
        @variant = variant
        @size = size
        @type = type
        @pressed = pressed
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        button(**toggle_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
