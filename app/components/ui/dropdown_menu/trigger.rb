# frozen_string_literal: true

module UI
  module DropdownMenu
    # Trigger - Phlex implementation
    #
    # Wrapper that adds toggle action to child element.
    # Uses DropdownMenuTriggerBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::DropdownMenu::Trigger.new { button { "Open Menu" } }
    class Trigger < Phlex::HTML
      include UI::DropdownMenu::DropdownMenuTriggerBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**dropdown_menu_trigger_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
