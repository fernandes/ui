# frozen_string_literal: true
    # ItemContentBehavior
    #
    # Shared behavior for Item content wrapper across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation and styling.
    module UI::ItemContentBehavior
      # Returns HTML attributes for the item content element
      def item_content_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: item_content_classes
        }.merge(attributes_value || {})
      end

      # Returns combined CSS classes
      def item_content_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          item_content_base_classes,
          classes_value

        ].compact.join(" "))
      end

      private

      # Base classes for item content (from shadcn/ui v4)
      def item_content_base_classes
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none"
      end
    end
