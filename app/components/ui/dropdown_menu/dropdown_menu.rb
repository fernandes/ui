# frozen_string_literal: true

module UI
  module DropdownMenu
    # DropdownMenu - Phlex implementation
    #
    # Container for dropdown menus with Stimulus controller for interactivity.
    # Uses DropdownMenuBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::DropdownMenu::DropdownMenu.new do
    #     render UI::DropdownMenu::Trigger.new { button { "Open" } }
    #     render UI::DropdownMenu::Content.new { "Items here" }
    #   end
    class DropdownMenu < Phlex::HTML
      include UI::DropdownMenu::DropdownMenuBehavior

      # @param placement [String] Floating UI placement (bottom-start, bottom-end, right-start, etc.)
      # @param offset [Integer] Offset from trigger in pixels
      # @param flip [Boolean] Enable/disable flip middleware
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(placement: "bottom-start", offset: 4, flip: true, classes: "", **attributes)
        @placement = placement
        @offset = offset
        @flip = flip
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dropdown_menu_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
