# frozen_string_literal: true

module UI
  module AlertDialog
    # Description - Phlex implementation
    #
    # Description text for the alert dialog.
    # Uses AlertDialogDescriptionBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::AlertDialog::Description.new { "This action cannot be undone." }
    class Description < Phlex::HTML
      include UI::AlertDialog::AlertDialogDescriptionBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        p(**alert_dialog_description_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
