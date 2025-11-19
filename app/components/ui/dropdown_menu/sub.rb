# frozen_string_literal: true

module UI
  module DropdownMenu
    # Sub - Phlex implementation
    #
    # Container for submenu with relative positioning.
    # Uses DropdownMenuSubBehavior concern for shared styling logic.
    #
    # @example Submenu
    #   render UI::DropdownMenu::Sub.new do
    #     render UI::DropdownMenu::SubTrigger.new { "More Options" }
    #     render UI::DropdownMenu::SubContent.new { "Submenu items" }
    #   end
    class Sub < Phlex::HTML
      include UI::DropdownMenu::DropdownMenuSubBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dropdown_menu_sub_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
