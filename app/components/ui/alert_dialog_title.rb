# frozen_string_literal: true

    # Title - Phlex implementation
    #
    # Title text for the alert dialog.
    # Uses AlertDialogTitleBehavior module for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Title.new { "Are you absolutely sure?" }
    class UI::AlertDialogTitle < Phlex::HTML
      include UI::AlertDialogTitleBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        h2(**alert_dialog_title_html_attributes) do
          yield if block_given?
        end
      end
    end
