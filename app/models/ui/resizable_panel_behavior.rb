# frozen_string_literal: true

    # Shared behavior for ResizablePanel component
    # Handles data attributes for individual panels
    module UI::ResizablePanelBehavior
      # Base CSS classes for the panel
      # Uses min-w-0/min-h-0 and overflow-hidden to allow panels to shrink to 0
      def panel_base_classes
        classes = ["relative overflow-hidden min-w-0 min-h-0"]
        classes << @classes if @classes.present?
        classes.join(" ")
      end

      # Generate data attributes for the panel
      def panel_data_attributes
        attrs = {
          ui__resizable_target: "panel"
        }
        attrs[:default_size] = @default_size if @default_size
        attrs[:min_size] = @min_size if @min_size
        attrs[:max_size] = @max_size if @max_size
        attrs
      end

      # Merge user-provided data attributes with panel data
      def merged_panel_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(panel_data_attributes)
      end

      # Build complete HTML attributes hash for panel
      def panel_html_attributes
        base_attrs = @attributes&.except(:data) || {}

        # Use flex-grow for proportional sizing instead of flex-basis percentage
        # This works correctly with min-height containers in vertical layouts
        style_parts = []
        if @default_size
          style_parts << "flex-grow: #{@default_size}"
          style_parts << "flex-shrink: #{@default_size}"
          style_parts << "flex-basis: 0"
        end

        attrs = base_attrs.merge(
          class: panel_base_classes,
          "data-slot": "resizable-panel",
          data: merged_panel_data_attributes
        )

        attrs[:style] = style_parts.join("; ") if style_parts.any?
        attrs
      end
    end
