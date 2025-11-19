# frozen_string_literal: true

module UI
  module Breadcrumb
    # BreadcrumbBehavior
    #
    # Shared behavior for Breadcrumb component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation for the breadcrumb container.
    module BreadcrumbBehavior
      # Returns HTML attributes for the breadcrumb container element
      def breadcrumb_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: breadcrumb_classes,
          "aria-label": "breadcrumb"
        }.merge(attributes_value || {})
      end

      # Returns combined CSS classes for the breadcrumb container
      def breadcrumb_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        classes_value || ""
      end
    end
  end
end
