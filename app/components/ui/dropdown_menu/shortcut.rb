# frozen_string_literal: true

module UI
  module DropdownMenu
    # Shortcut - Phlex implementation
    #
    # Keyboard shortcut indicator displayed at the end of menu items.
    # Uses DropdownMenuShortcutBehavior concern for shared styling logic.
    #
    # @example Shortcut
    #   render UI::DropdownMenu::Shortcut.new { "⌘K" }
    class Shortcut < Phlex::HTML
      include UI::DropdownMenu::DropdownMenuShortcutBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        span(**dropdown_menu_shortcut_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
