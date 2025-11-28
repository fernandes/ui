# frozen_string_literal: true
    # ItemSeparatorBehavior
    #
    # Shared behavior for Item separator across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation and styling.
    module UI::ItemSeparatorBehavior
      # Returns HTML attributes for the item separator element
      def item_separator_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: item_separator_classes
        }.merge(attributes_value || {})
      end

      # Returns combined CSS classes
      def item_separator_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          item_separator_base_classes,
          classes_value

        ].compact.join(" "))
      end

      private

      # Base classes for item separator
      def item_separator_base_classes
        ""
      end
    end
