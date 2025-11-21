# frozen_string_literal: true

module UI
  module ContextMenu
    # Shortcut - Phlex implementation
    #
    # Displays keyboard shortcut text for a menu item.
    # Uses ContextMenuShortcutBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::ContextMenu::Shortcut.new { "⌘K" }
    class Shortcut < Phlex::HTML
      include UI::ContextMenu::ContextMenuShortcutBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        span(**context_menu_shortcut_html_attributes.merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
