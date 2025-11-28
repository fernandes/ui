# frozen_string_literal: true

    # ToggleGroup - Phlex implementation
    #
    # A container for a set of toggle items that can be toggled on or off.
    # Supports single and multiple selection modes.
    #
    # @example Basic usage (single selection)
    #   render UI::ToggleGroup.new(type: "single") do
    #     render UI::Item.new(value: "left") { "Left" }
    #     render UI::Item.new(value: "center") { "Center" }
    #     render UI::Item.new(value: "right") { "Right" }
    #   end
    #
    # @example Multiple selection
    #   render UI::ToggleGroup.new(type: "multiple", value: ["bold", "italic"]) do
    #     render UI::Item.new(value: "bold") { "Bold" }
    #     render UI::Item.new(value: "italic") { "Italic" }
    #   end
    class UI::ToggleGroup < Phlex::HTML
      include UI::ToggleGroupBehavior

      # @param type [String] Selection mode: "single" or "multiple"
      # @param variant [String] Visual style variant (default, outline)
      # @param size [String] Size variant (default, sm, lg)
      # @param value [String, Array] Current selected value(s)
      # @param spacing [Integer] Gap between items (0 means items touch)
      # @param orientation [String] Layout direction (horizontal, vertical)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(type: "single", variant: "default", size: "default", value: nil, spacing: 0, orientation: nil, classes: "", **attributes)
        @type = type
        @variant = variant
        @size = size
        @value = value
        @spacing = spacing
        @orientation = orientation
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**toggle_group_html_attributes.deep_merge(@attributes)) do
          # Store context for child items to access
          @context = {
            variant: @variant,
            size: @size,
            type: @type,
            spacing: @spacing,
            value: @value
          }
          yield if block_given?
        end
      end

      # Accessor for child components to get parent context
      attr_reader :context
    end
