# frozen_string_literal: true
module UI
  module Item
    # ItemHeaderBehavior
    #
    # Shared behavior for Item header section across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation and styling.
    module ItemHeaderBehavior
      # Returns HTML attributes for the item header element
      def item_header_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: item_header_classes
        }.merge(attributes_value || {})
      end

      # Returns combined CSS classes
      def item_header_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          item_header_base_classes,
          classes_value

        ].compact.join(" "))
      end

      private

      # Base classes for item header (from shadcn/ui v4)
      def item_header_base_classes
        "flex w-full items-center justify-between pb-2"
      end
    end
  end
end
