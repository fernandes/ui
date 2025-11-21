# frozen_string_literal: true

module UI
  module ContextMenu
    # RadioGroup - Phlex implementation
    #
    # Container for radio menu items.
    # Uses ContextMenuRadioGroupBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::ContextMenu::RadioGroup.new do
    #     render UI::ContextMenu::RadioItem.new(checked: true) { "Option 1" }
    #     render UI::ContextMenu::RadioItem.new { "Option 2" }
    #   end
    class RadioGroup < Phlex::HTML
      include UI::ContextMenu::ContextMenuRadioGroupBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**context_menu_radio_group_html_attributes.merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
