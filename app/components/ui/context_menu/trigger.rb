# frozen_string_literal: true

module UI
  module ContextMenu
    # Trigger - Phlex implementation
    #
    # The element that triggers the context menu on right-click.
    # Uses ContextMenuTriggerBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::ContextMenu::Trigger.new do
    #     "Right click here"
    #   end
    class Trigger < Phlex::HTML
      include UI::ContextMenu::ContextMenuTriggerBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**context_menu_trigger_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
