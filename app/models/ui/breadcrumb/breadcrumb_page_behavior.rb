# frozen_string_literal: true

module UI
  module Breadcrumb
    # BreadcrumbPageBehavior
    #
    # Shared behavior for Breadcrumb Page component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation for the current page indicator.
    module BreadcrumbPageBehavior
      # Returns HTML attributes for the breadcrumb page element
      def breadcrumb_page_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: breadcrumb_page_classes,
          role: "link",
          "aria-disabled": "true",
          "aria-current": "page"
        }.merge(attributes_value || {})
      end

      # Returns combined CSS classes for the breadcrumb page
      def breadcrumb_page_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          breadcrumb_page_base_classes,
          classes_value

        ].compact.join(" "))
      end

      private

      # Base classes applied to breadcrumb page
      def breadcrumb_page_base_classes
        "font-normal text-foreground"
      end
    end
  end
end
