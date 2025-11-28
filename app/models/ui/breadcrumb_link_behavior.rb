# frozen_string_literal: true

    # BreadcrumbLinkBehavior
    #
    # Shared behavior for Breadcrumb Link component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation for breadcrumb links.
    module UI::BreadcrumbLinkBehavior
      # Returns HTML attributes for the breadcrumb link element
      def breadcrumb_link_html_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        {
          class: breadcrumb_link_classes,
          href: @href || "#"
        }.merge(attributes_value || {})
      end

      # Returns combined CSS classes for the breadcrumb link
      def breadcrumb_link_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          breadcrumb_link_base_classes,
          classes_value

        ].compact.join(" "))
      end

      private

      # Base classes applied to breadcrumb link
      def breadcrumb_link_base_classes
        "transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
      end
    end
