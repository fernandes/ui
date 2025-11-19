# frozen_string_literal: true

module UI
  module AlertDialog
    # Footer - Phlex implementation
    #
    # Footer section with action buttons for the alert dialog.
    # Uses AlertDialogFooterBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::AlertDialog::Footer.new do
    #     render UI::AlertDialog::Cancel.new { "Cancel" }
    #     render UI::AlertDialog::Action.new { "Continue" }
    #   end
    class Footer < Phlex::HTML
      include UI::AlertDialog::AlertDialogFooterBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**alert_dialog_footer_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
