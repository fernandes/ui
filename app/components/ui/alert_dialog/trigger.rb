# frozen_string_literal: true

module UI
  module AlertDialog
    # Trigger - Phlex implementation
    #
    # A wrapper that adds the alert dialog open action to its child element.
    # Uses AlertDialogTriggerBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::AlertDialog::Trigger.new do
    #     render UI::Button.new { "Open Alert Dialog" }
    #   end
    class Trigger < Phlex::HTML
      include UI::AlertDialog::AlertDialogTriggerBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**alert_dialog_trigger_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
