# frozen_string_literal: true

require "tailwind_merge"

module UI
  module AlertDialog
    # Shared behavior for AlertDialog Header component
    # Handles header section styling
    module AlertDialogHeaderBehavior
      # Base CSS classes for alert dialog header
      def alert_dialog_header_base_classes
        "flex flex-col gap-2 text-center sm:text-left"
      end

      # Merge base classes with custom classes using TailwindMerge
      def alert_dialog_header_classes
        TailwindMerge::Merger.new.merge([alert_dialog_header_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for alert dialog header
      def alert_dialog_header_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(
          class: alert_dialog_header_classes
        )
      end
    end
  end
end
