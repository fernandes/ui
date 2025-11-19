# frozen_string_literal: true

require "tailwind_merge"

module UI
  module AlertDialog
    # Shared behavior for AlertDialog component
    # Handles classes and data attributes
    module AlertDialogBehavior
      # Base CSS classes for alert dialog container
      def alert_dialog_base_classes
        ""
      end

      # Merge base classes with custom classes using TailwindMerge
      def alert_dialog_classes
        TailwindMerge::Merger.new.merge([alert_dialog_base_classes, @classes].compact.join(" "))
      end

      # Data attributes for Stimulus controller
      def alert_dialog_data_attributes
        {
          controller: "ui--alert-dialog",
          ui__alert_dialog_open_value: @open,
          ui__alert_dialog_close_on_escape_value: @close_on_escape
        }
      end

      # Merge user-provided data attributes
      def merged_alert_dialog_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(alert_dialog_data_attributes)
      end

      # Build complete HTML attributes hash for alert dialog container
      def alert_dialog_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: alert_dialog_classes,
          data: merged_alert_dialog_data_attributes
        )
      end
    end
  end
end
