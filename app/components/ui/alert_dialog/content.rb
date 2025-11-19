# frozen_string_literal: true

module UI
  module AlertDialog
    # Content - Phlex implementation
    #
    # Main alert dialog content area with proper ARIA attributes.
    # Uses AlertDialogContentBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::AlertDialog::Content.new { "Alert dialog content here" }
    class Content < Phlex::HTML
      include UI::AlertDialog::AlertDialogContentBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**alert_dialog_content_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
