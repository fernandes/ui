# frozen_string_literal: true

    # Shared behavior for HoverCard component
    # Provides HTML attributes and styling for the root container
    module UI::HoverCardBehavior
      # Returns HTML attributes for the hover card container element
      def hover_card_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: hover_card_classes,
          data: hover_card_data_attributes
        }.merge(attributes_value)
      end

      # Returns combined CSS classes for the hover card
      def hover_card_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for the hover card controller
      def hover_card_data_attributes
        {
          controller: "ui--hover-card"
        }
      end
    end
