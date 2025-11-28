# frozen_string_literal: true

    # DropdownMenuComponent - ViewComponent implementation
    #
    # Container for dropdown menus with Stimulus controller for interactivity.
    # Uses DropdownMenuBehavior concern for shared styling logic.
    #
    # Supports asChild pattern for composition without wrapper elements.
    #
    # @example Basic usage
    #   render UI::DropdownMenuComponent.new do
    #     render UI::TriggerComponent.new { "Open" }
    #     render UI::ContentComponent.new { "Items" }
    #   end
    #
    # @example With asChild (no wrapper div)
    #   render UI::DropdownMenuComponent.new(as_child: true) do |dropdown_attrs|
    #     # receive dropdown data attrs and pass them to trigger
    #   end
    class UI::DropdownMenuComponent < ViewComponent::Base
      include UI::DropdownMenuBehavior
      include UI::SharedAsChildBehavior

      def initialize(as_child: false, placement: "bottom-start", offset: 4, flip: true, classes: "", **attributes)
        @as_child = as_child
        @placement = placement
        @offset = offset
        @flip = flip
        @classes = classes
        @attributes = attributes
      end

      def call
        dropdown_attrs = dropdown_menu_html_attributes.deep_merge(@attributes)

        if @as_child
          # Yield attributes to block - child receives controller setup
          content_for(:dropdown_attrs, dropdown_attrs)
          content
        else
          # Default: render wrapper div with controller
          content_tag :div, **dropdown_attrs do
            content
          end
        end
      end

      # Provide dropdown attributes to the block
      def dropdown_attrs
        dropdown_menu_html_attributes.deep_merge(@attributes)
      end
    end
