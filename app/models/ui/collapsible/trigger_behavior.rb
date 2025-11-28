# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Collapsible
    # TriggerBehavior
    #
    # Shared behavior for CollapsibleTrigger component across ERB, ViewComponent, and Phlex implementations.
    module TriggerBehavior
      # Base classes for standalone trigger (when not using as_child with Button)
      # Includes focus ring, sizing, and ghost-like hover styles
      # Matches Button with variant: :ghost, size: :sm, classes: "w-9 p-0"
      TRIGGER_BASE_CLASSES = [
        # Focus styles
        "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        # Base button styles (rounded-lg to match Button)
        "inline-flex items-center justify-center rounded-lg",
        # Size (h-8 from size: :sm, w-9 and p-0 from custom classes)
        "h-8 w-9 p-0",
        # Ghost variant hover
        "hover:bg-accent hover:text-accent-foreground",
        # Transition
        "transition-colors"
      ].join(" ")

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
        as_child_value = respond_to?(:as_child, true) ? as_child : @as_child

        # Only apply base classes when NOT using as_child mode
        # When as_child is true, the parent component provides its own styling
        if as_child_value
          return nil if classes_value.blank?
          TailwindMerge::Merger.new.merge([classes_value].compact.join(" "))
        else
          TailwindMerge::Merger.new.merge([TRIGGER_BASE_CLASSES, classes_value].compact.join(" "))
        end
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
