# frozen_string_literal: true

module UI
  module Accordion
    # Shared behavior for Accordion container component
    # Handles Stimulus controller setup and data attributes
    module AccordionBehavior
      # Generate Stimulus controller data attributes
      def accordion_data_attributes
        {
          controller: "ui--accordion",
          ui__accordion_type_value: @type || "single",
          ui__accordion_collapsible_value: @collapsible || false
        }
      end

      # Merge user-provided data attributes with accordion controller data
      def merged_data_attributes
        user_data = @attributes&.fetch(:data, {}) || {}
        user_data.merge(accordion_data_attributes)
      end

      # Build complete HTML attributes hash for accordion container
      def accordion_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          class: @classes || "",
          "data-orientation": @orientation || "vertical",
          data: merged_data_attributes
        )
      end
    end
  end
end
