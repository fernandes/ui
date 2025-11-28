# frozen_string_literal: true

    # Shared behavior for Pagination Ellipsis component
    # Handles ellipsis indicator for skipped pages
    module UI::PaginationEllipsisBehavior
      # Base CSS classes for ellipsis
      def ellipsis_base_classes
        "flex size-9 items-center justify-center"
      end

      # Merge base classes with custom classes using TailwindMerge
      def ellipsis_classes
        TailwindMerge::Merger.new.merge([ellipsis_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for ellipsis
      def ellipsis_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(
          "aria-hidden": "true",
          "data-slot": "pagination-ellipsis",
          class: ellipsis_classes
        )
      end
    end
