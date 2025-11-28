# frozen_string_literal: true

    # BreadcrumbEllipsisBehavior
    #
    # Shared behavior for Breadcrumb Ellipsis component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation for collapsed items indicator.
    module UI::BreadcrumbEllipsisBehavior
      # Returns HTML attributes for the breadcrumb ellipsis element
      def breadcrumb_ellipsis_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: breadcrumb_ellipsis_classes,
          role: "presentation",
          "aria-hidden": "true"
        }.merge(attributes_value || {})
      end

      # Returns combined CSS classes for the breadcrumb ellipsis
      def breadcrumb_ellipsis_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          breadcrumb_ellipsis_base_classes,
          classes_value

        ].compact.join(" "))
      end

      private

      # Base classes applied to breadcrumb ellipsis
      def breadcrumb_ellipsis_base_classes
        "flex h-9 w-9 items-center justify-center"
      end
    end
