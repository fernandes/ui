# frozen_string_literal: true

require "tailwind_merge"

module UI
  module AlertDialog
    # Shared behavior for AlertDialog Footer component
    # Handles footer section styling with action buttons
    module AlertDialogFooterBehavior
      # Base CSS classes for alert dialog footer
      # Note: flex-col-reverse on mobile so cancel appears below action, then row on desktop with buttons at end
      def alert_dialog_footer_base_classes
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
      end

      # Merge base classes with custom classes using TailwindMerge
      def alert_dialog_footer_classes
        TailwindMerge::Merger.new.merge([alert_dialog_footer_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for alert dialog footer
      def alert_dialog_footer_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(
          class: alert_dialog_footer_classes
        )
      end
    end
  end
end
