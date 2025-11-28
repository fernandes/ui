# frozen_string_literal: true

require "tailwind_merge"

    # TooltipBehavior
    #
    # Shared behavior for Tooltip root component.
    # The Tooltip acts as a container and manages the tooltip state via Stimulus.
    module UI::TooltipBehavior
      # Returns HTML attributes for the tooltip root element
      def tooltip_html_attributes
        {
          data: tooltip_data_attributes
        }.compact
      end

      # Returns data attributes for the tooltip controller
      def tooltip_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        base_data = (attributes_value&.fetch(:data, {}) || {})

        # Add tooltip controller
        controllers = [base_data[:controller], "ui--tooltip"].compact.join(" ")

        base_data.merge({
          controller: controllers
        }).compact
      end
    end
