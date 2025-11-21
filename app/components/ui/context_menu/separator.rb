# frozen_string_literal: true

module UI
  module ContextMenu
    # Separator - Phlex implementation
    #
    # A visual divider between menu items.
    # Uses ContextMenuSeparatorBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::ContextMenu::Separator.new
    class Separator < Phlex::HTML
      include UI::ContextMenu::ContextMenuSeparatorBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**context_menu_separator_html_attributes.merge(@attributes))
      end
    end
  end
end
