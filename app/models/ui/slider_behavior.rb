# frozen_string_literal: true

    # Shared behavior for Slider Root component
    # Handles Stimulus controller setup and data attributes for range slider
    module UI::SliderBehavior
      # Generate Stimulus controller data attributes
      def slider_data_attributes
        attrs = {
          controller: "ui--slider",
          ui__slider_min_value: @min || 0,
          ui__slider_max_value: @max || 100,
          ui__slider_step_value: @step || 1,
          ui__slider_value_value: (@value || @default_value || [0]).to_json,
          ui__slider_disabled_value: @disabled || false,
          ui__slider_orientation_value: @orientation || "horizontal",
          ui__slider_inverted_value: @inverted || false,
          ui__slider_name_value: @name || ""
        }

        # Add center_point if defined (for bidirectional sliders like balance/pan)
        if @center_point
          attrs[:ui__slider_center_point_value] = @center_point
        end

        attrs
      end

      # Merge user-provided data attributes with slider controller data
      def merged_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(slider_data_attributes)
      end

      # Build complete HTML attributes hash for slider root
      def slider_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col #{@classes}".strip,
          "data-orientation": @orientation || "horizontal",
          "data-disabled": @disabled ? "" : nil,
          "data-slot": "slider",
          role: "group",
          data: merged_data_attributes
        ).compact
      end
    end
