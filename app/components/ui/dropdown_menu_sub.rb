# frozen_string_literal: true

    # Sub - Phlex implementation
    #
    # Container for submenu with relative positioning.
    # Uses DropdownMenuSubBehavior concern for shared styling logic.
    #
    # @example Submenu
    #   render UI::Sub.new do
    #     render UI::SubTrigger.new { "More Options" }
    #     render UI::SubContent.new { "Submenu items" }
    #   end
    class UI::DropdownMenuSub < Phlex::HTML
      include UI::DropdownMenuSubBehavior

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
