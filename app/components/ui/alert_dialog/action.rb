# frozen_string_literal: true

module UI
  module AlertDialog
    # Action - Phlex implementation
    #
    # Primary action button for the alert dialog.
    # Wraps the Button component with alert dialog close action.
    #
    # @example Basic usage
    #   render UI::AlertDialog::Action.new { "Continue" }
    class Action < Phlex::HTML
      include UI::AlertDialog::AlertDialogActionBehavior

      # @param variant [String, Symbol] Button variant
      # @param size [String, Symbol] Button size
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(variant: :default, size: :default, classes: "", **attributes)
        @variant = variant
        @size = size
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        render UI::Button::Button.new(
          variant: @variant,
          size: @size,
          classes: @classes,
          **alert_dialog_action_button_data_attributes.merge(@attributes)
        ) do
          yield if block_given?
        end
      end
    end
  end
end
