# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Collapsible
    # TriggerBehavior
    #
    # Shared behavior for CollapsibleTrigger component across ERB, ViewComponent, and Phlex implementations.
    module TriggerBehavior
      def collapsible_trigger_html_attributes
        attrs = {
          data: collapsible_trigger_data_attributes
        }
        trigger_classes = collapsible_trigger_classes
        attrs[:class] = trigger_classes unless trigger_classes.blank?
        attrs
      end

      def collapsible_trigger_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        return nil if classes_value.blank?
        TailwindMerge::Merger.new.merge([classes_value].compact.join(" "))
      end

      def collapsible_trigger_data_attributes
        {
          slot: "collapsible-trigger",
          ui__collapsible_target: "trigger",
          action: "click->ui--collapsible#toggle"
        }
      end
    end
  end
end
