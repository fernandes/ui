# frozen_string_literal: true

module UI
  module ContextMenu
    # Label - Phlex implementation
    #
    # Non-interactive label for grouping menu items.
    # Uses ContextMenuLabelBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::ContextMenu::Label.new { "Group Label" }
    class Label < Phlex::HTML
      include UI::ContextMenu::ContextMenuLabelBehavior

      # @param inset [Boolean] Whether to add left padding for alignment
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(inset: false, classes: "", **attributes)
        @inset = inset
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**context_menu_label_html_attributes.merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
