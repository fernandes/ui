# frozen_string_literal: true

module UI
  module ContextMenu
    # Content - Phlex implementation
    #
    # Menu items container with animations and positioning.
    # Uses ContextMenuContentBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::ContextMenu::Content.new do
    #     render UI::ContextMenu::Item.new { "Menu Item" }
    #   end
    class Content < Phlex::HTML
      include UI::ContextMenu::ContextMenuContentBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**context_menu_content_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
