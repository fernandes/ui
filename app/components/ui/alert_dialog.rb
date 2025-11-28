# frozen_string_literal: true

    # AlertDialog - Phlex implementation
    #
    # A modal alert dialog component for important confirmations and alerts.
    # Uses AlertDialogBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::AlertDialog.new do
    #     render UI::Trigger.new { "Open Alert Dialog" }
    #     render UI::Overlay.new
    #     render UI::Content.new { "Alert dialog content here" }
    #   end
    class UI::AlertDialog < Phlex::HTML
      include UI::AlertDialogBehavior

      # @param open [Boolean] Whether the alert dialog is initially open
      # @param close_on_escape [Boolean] Whether pressing Escape closes the dialog
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(open: false, close_on_escape: true, classes: "", **attributes)
        @open = open
        @close_on_escape = close_on_escape
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**alert_dialog_html_attributes) do
          yield if block_given?
        end
      end
    end
