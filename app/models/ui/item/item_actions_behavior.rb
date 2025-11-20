# frozen_string_literal: true
module UI
  module Item
    # ItemActionsBehavior
    #
    # Shared behavior for Item actions container across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation and styling.
    module ItemActionsBehavior
      # Returns HTML attributes for the item actions element
      def item_actions_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: item_actions_classes
        }.merge(attributes_value || {})
      end

      # Returns combined CSS classes
      def item_actions_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          item_actions_base_classes,
          classes_value

        ].compact.join(" "))
      end

      private

      # Base classes for item actions (from shadcn/ui v4)
      def item_actions_base_classes
        "flex shrink-0 items-center gap-2"
      end
    end
  end
end
