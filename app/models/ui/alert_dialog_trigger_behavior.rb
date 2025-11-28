# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for AlertDialog Trigger component
    # Handles classes and Stimulus actions
    module UI::AlertDialogTriggerBehavior
      # Base CSS classes for alert dialog trigger wrapper
      def alert_dialog_trigger_base_classes
        "inline-flex"
      end

      # Merge base classes with custom classes using TailwindMerge
      def alert_dialog_trigger_classes
        TailwindMerge::Merger.new.merge([alert_dialog_trigger_base_classes, @classes].compact.join(" "))
      end

      # Data attributes for Stimulus action
      def alert_dialog_trigger_data_attributes
        {
          action: "click->ui--alert-dialog#open"
        }
      end

      # Merge user-provided data attributes
      def merged_alert_dialog_trigger_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(alert_dialog_trigger_data_attributes)
      end

      # Build complete HTML attributes hash for alert dialog trigger
      def alert_dialog_trigger_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: alert_dialog_trigger_classes,
          data: merged_alert_dialog_trigger_data_attributes
        )
      end
    end
