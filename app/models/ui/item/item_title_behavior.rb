# frozen_string_literal: true
module UI
  module Item
    # ItemTitleBehavior
    #
    # Shared behavior for Item title text across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation and styling.
    module ItemTitleBehavior
      # Returns HTML attributes for the item title element
      def item_title_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: item_title_classes
        }.merge(attributes_value || {})
      end

      # Returns combined CSS classes
      def item_title_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          item_title_base_classes,
          classes_value

        ].compact.join(" "))
      end

      private

      # Base classes for item title (from shadcn/ui v4)
      def item_title_base_classes
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium"
      end
    end
  end
end
