# frozen_string_literal: true

module UI
  module Tabs
    # Shared behavior for Tabs container component
    # Handles Stimulus controller setup and data attributes
    module TabsBehavior
      # Generate Stimulus controller data attributes
      def tabs_data_attributes
        {
          controller: "ui--tabs",
          ui__tabs_default_value_value: @default_value || "",
          ui__tabs_orientation_value: @orientation || "horizontal",
          ui__tabs_activation_mode_value: @activation_mode || "automatic"
        }
      end

      # Merge user-provided data attributes with tabs controller data
      def merged_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(tabs_data_attributes)
      end

      # Build complete HTML attributes hash for tabs container
      def tabs_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: "flex flex-col gap-2 #{@classes}".strip,
          "data-orientation": @orientation || "horizontal",
          "data-slot": "tabs",
          data: merged_data_attributes
        )
      end
    end
  end
end
