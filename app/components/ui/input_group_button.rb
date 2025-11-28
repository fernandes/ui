# frozen_string_literal: true

    # Button - Phlex implementation
    #
    # A button component specifically styled for use within input groups.
    # Uses both ButtonBehavior and InputGroupButtonBehavior for styling.
    #
    # @example Basic button
    #   render UI::Button.new { "Search" }
    #
    # @example Icon button
    #   render UI::Button.new(size: "icon-xs") { unsafe_raw "<svg>...</svg>" }
    class UI::InputGroupButton < Phlex::HTML
      include UI::ButtonBehavior
      include UI::InputGroupButtonBehavior

      # @param size [String] Size variant: "xs", "sm", "icon-xs", "icon-sm"
      # @param variant [String] Button variant (default: "ghost")
      # @param type [String] Button type attribute (default: "button")
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(size: "xs", variant: "ghost", type: "button", classes: "", **attributes)
        @size = size
        @variant = variant
        @type = type
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        # Use input_group_button_classes which includes button behavior + input group styling
        button(
          type: @type,
          class: input_group_button_classes,
          **@attributes.except(:type, :variant, :size)
        ) do
          yield if block_given?
        end
      end
    end
