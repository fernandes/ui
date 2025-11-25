# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sheet
    # Shared behavior for Sheet component
    # Reuses ui--dialog Stimulus controller since Sheet extends Dialog
    module SheetBehavior
      # Generate data attributes for Stimulus controller
      def sheet_data_attributes
        attrs = {
          controller: "ui--dialog",
          ui__dialog_open_value: @open.to_s
        }

        # Only add optional values if they are explicitly set (not nil)
        attrs[:ui__dialog_close_on_escape_value] = @close_on_escape.to_s unless @close_on_escape.nil?
        attrs[:ui__dialog_close_on_overlay_click_value] = @close_on_overlay_click.to_s unless @close_on_overlay_click.nil?

        attrs
      end

      # Merge user-provided data attributes
      def merged_sheet_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(sheet_data_attributes)
      end

      # Build complete HTML attributes hash
      def sheet_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: sheet_classes,
          data: merged_sheet_data_attributes
        )
      end

      # Base CSS classes
      def sheet_base_classes
        ""
      end

      # Generate final classes using TailwindMerge
      def sheet_classes
        TailwindMerge::Merger.new.merge([sheet_base_classes, @classes].compact.join(" "))
      end
    end
  end
end
