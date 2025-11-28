# frozen_string_literal: true

module UI
  module HoverCard
    # Shared behavior for HoverCardTrigger component
    # Provides HTML attributes and styling for the trigger element
    # Supports asChild pattern for composition
    module HoverCardTriggerBehavior
      # Returns HTML attributes for the hover card trigger element
      def trigger_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: trigger_classes,
          data: trigger_data_attributes
        }.merge(attributes_value)
      end

      # Returns combined CSS classes for the hover card trigger
      def trigger_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          trigger_base_classes,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for the hover card trigger
      def trigger_data_attributes
        {
          "ui__hover_card_target": "trigger",
          "action": "mouseenter->ui--hover-card#show mouseleave->ui--hover-card#hide"
        }
      end

      private

      # Base classes applied to all hover card triggers
      # Includes inline-flex for alignment and focus ring for keyboard navigation
      def trigger_base_classes
        [
          "inline-flex",
          "rounded-sm",
          "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        ].join(" ")
      end
    end
  end
end
