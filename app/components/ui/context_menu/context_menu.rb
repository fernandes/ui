# frozen_string_literal: true

module UI
  module ContextMenu
    # ContextMenu - Phlex implementation
    #
    # Container for context menus triggered by right-click.
    # Uses ContextMenuBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::ContextMenu::ContextMenu.new do
    #     render UI::ContextMenu::Trigger.new { "Right-click me" }
    #     render UI::ContextMenu::Content.new do
    #       render UI::ContextMenu::Item.new { "Menu Item" }
    #     end
    #   end
    class ContextMenu < Phlex::HTML
      include UI::ContextMenu::ContextMenuBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**context_menu_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
