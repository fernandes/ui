# frozen_string_literal: true

    # DropdownMenu - Phlex implementation
    #
    # Container for dropdown menus with Stimulus controller for interactivity.
    # Uses DropdownMenuBehavior concern for shared styling logic.
    #
    # Supports asChild pattern for composition without wrapper elements.
    #
    # @example Basic usage
    #   render UI::DropdownMenu.new do
    #     render UI::Trigger.new { button { "Open" } }
    #     render UI::Content.new { "Items here" }
    #   end
    #
    # @example With asChild (no wrapper div)
    #   render UI::DropdownMenu.new(as_child: true) do |dropdown_attrs|
    #     # DropdownMenu yields data attributes to first child
    #     render UI::Trigger.new(**dropdown_attrs, as_child: true) do |trigger_attrs|
    #       render UI::Button.new(**trigger_attrs) { "Menu" }
    #     end
    #     render UI::Content.new { "Items" }
    #   end
    class UI::DropdownMenu < Phlex::HTML
      include UI::DropdownMenuBehavior
      include UI::SharedAsChildBehavior

      # @param as_child [Boolean] When true, yields attributes to block instead of rendering wrapper
      # @param placement [String] Floating UI placement (bottom-start, bottom-end, right-start, etc.)
      # @param offset [Integer] Offset from trigger in pixels
      # @param flip [Boolean] Enable/disable flip middleware
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, placement: "bottom-start", offset: 4, flip: true, classes: "", **attributes)
        @as_child = as_child
        @placement = placement
        @offset = offset
        @flip = flip
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        dropdown_attrs = dropdown_menu_html_attributes.deep_merge(@attributes)

        if @as_child
          # Yield data attributes to block - child receives controller setup
          yield(dropdown_attrs) if block_given?
        else
          # Default: render wrapper div with controller
          div(**dropdown_attrs) do
            yield if block_given?
          end
        end
      end
    end
