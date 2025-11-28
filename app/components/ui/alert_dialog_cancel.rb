# frozen_string_literal: true

    # Cancel - Phlex implementation
    #
    # Cancel button for the alert dialog.
    # Wraps the Button component with alert dialog close action.
    #
    # @example Basic usage
    #   render UI::Cancel.new { "Cancel" }
    class UI::AlertDialogCancel < Phlex::HTML
      include UI::AlertDialogCancelBehavior

      # @param variant [String, Symbol] Button variant
      # @param size [String, Symbol] Button size
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: :outline, size: :default, classes: "", **attributes)
        @variant = variant
        @size = size
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        render UI::Button.new(
          variant: @variant,
          size: @size,
          classes: @classes,
          **alert_dialog_cancel_button_data_attributes.merge(@attributes)
        ) do
          yield if block_given?
        end
      end
    end
