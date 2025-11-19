# frozen_string_literal: true

module UI
  module DropdownMenu
    # RadioGroup - Phlex implementation
    #
    # Container for radio items providing semantic grouping.
    # Uses DropdownMenuRadioGroupBehavior concern for shared styling logic.
    #
    # @example Radio group
    #   render UI::DropdownMenu::RadioGroup.new do
    #     render UI::DropdownMenu::RadioItem.new(value: "top", checked: true) { "Top" }
    #     render UI::DropdownMenu::RadioItem.new(value: "bottom") { "Bottom" }
    #   end
    class RadioGroup < Phlex::HTML
      include UI::DropdownMenu::DropdownMenuRadioGroupBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dropdown_menu_radio_group_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
