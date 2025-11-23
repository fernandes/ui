# frozen_string_literal: true

require "tailwind_merge"

module UI
  module ResponsiveDialog
    # Shared behavior for ResponsiveDialog component
    # Combines Dialog (desktop) and Drawer (mobile) with responsive switching
    module ResponsiveDialogBehavior
      # Generate data attributes for Stimulus controller
      def responsive_dialog_data_attributes
        {
          controller: "ui--responsive-dialog",
          ui__responsive_dialog_open_value: @open,
          ui__responsive_dialog_breakpoint_value: @breakpoint || 768
        }
      end

      # Merge user-provided data attributes
      def merged_responsive_dialog_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(responsive_dialog_data_attributes)
      end

      # Build complete HTML attributes hash
      def responsive_dialog_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: responsive_dialog_classes,
          data: merged_responsive_dialog_data_attributes
        )
      end

      # Base CSS classes
      def responsive_dialog_base_classes
        ""
      end

      # Generate final classes using TailwindMerge
      def responsive_dialog_classes
        TailwindMerge::Merger.new.merge([responsive_dialog_base_classes, @classes].compact.join(" "))
      end
    end
  end
end
