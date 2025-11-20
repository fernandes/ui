# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Tooltip
    # TooltipTriggerBehavior
    #
    # Shared behavior for TooltipTrigger component.
    # The trigger activates the tooltip on hover/focus.
    # Supports asChild pattern for composition.
    module TooltipTriggerBehavior
      # Returns HTML attributes for the tooltip trigger element
      def tooltip_trigger_html_attributes
        {
          data: tooltip_trigger_data_attributes
        }.compact
      end

      # Returns data attributes for the tooltip trigger
      def tooltip_trigger_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        base_data = (attributes_value&.fetch(:data, {}) || {})

        base_data.merge({
          ui__tooltip_target: "trigger",
          action: [base_data[:action], "mouseenter->ui--tooltip#show mouseleave->ui--tooltip#hide focus->ui--tooltip#show blur->ui--tooltip#hide"].compact.join(" ")
        }).compact
      end
    end
  end
end
