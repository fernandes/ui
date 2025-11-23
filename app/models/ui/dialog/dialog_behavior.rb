# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Dialog
    # Shared behavior for Dialog component
    # Handles main component logic and data attributes
    module DialogBehavior
      # Generate data attributes for Stimulus controller
      def dialog_data_attributes
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
      def merged_dialog_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(dialog_data_attributes)
      end

      # Build complete HTML attributes hash
      def dialog_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: dialog_classes,
          data: merged_dialog_data_attributes
        )
      end

      # Base CSS classes
      def dialog_base_classes
        ""
      end

      # Generate final classes using TailwindMerge
      def dialog_classes
        TailwindMerge::Merger.new.merge([dialog_base_classes, @classes].compact.join(" "))
      end
    end
  end
end
