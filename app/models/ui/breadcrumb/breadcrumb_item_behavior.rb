# frozen_string_literal: true

module UI
  module Breadcrumb
    # BreadcrumbItemBehavior
    #
    # Shared behavior for Breadcrumb Item component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation for individual breadcrumb items.
    module BreadcrumbItemBehavior
      # Returns HTML attributes for the breadcrumb item element
      def breadcrumb_item_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: breadcrumb_item_classes
        }.merge(attributes_value || {})
      end

      # Returns combined CSS classes for the breadcrumb item
      def breadcrumb_item_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          breadcrumb_item_base_classes,
          classes_value

        ].compact.join(" "))
      end

      private

      # Base classes applied to breadcrumb item
      def breadcrumb_item_base_classes
        "inline-flex items-center gap-1.5"
      end
    end
  end
end
