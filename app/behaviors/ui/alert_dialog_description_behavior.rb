# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for AlertDialog Description component
    # Handles description text styling
    module UI::AlertDialogDescriptionBehavior
      # Base CSS classes for alert dialog description
      def alert_dialog_description_base_classes
        "text-muted-foreground text-sm"
      end

      # Merge base classes with custom classes using TailwindMerge
      def alert_dialog_description_classes
        TailwindMerge::Merger.new.merge([alert_dialog_description_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for alert dialog description
      def alert_dialog_description_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(
          class: alert_dialog_description_classes
        )
      end
    end
