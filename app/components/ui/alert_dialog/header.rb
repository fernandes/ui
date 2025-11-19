# frozen_string_literal: true

module UI
  module AlertDialog
    # Header - Phlex implementation
    #
    # Header section of the alert dialog.
    # Uses AlertDialogHeaderBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::AlertDialog::Header.new do
    #     render UI::AlertDialog::Title.new { "Alert Title" }
    #   end
    class Header < Phlex::HTML
      include UI::AlertDialog::AlertDialogHeaderBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**alert_dialog_header_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
