# frozen_string_literal: true

    # Shared behavior for Pagination container component
    # Handles navigation role and aria attributes
    module UI::PaginationBehavior
      # Base CSS classes for pagination container
      def pagination_base_classes
        "mx-auto flex w-full justify-center"
      end

      # Merge base classes with custom classes using TailwindMerge
      def pagination_classes
        TailwindMerge::Merger.new.merge([pagination_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for pagination container
      def pagination_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        base_attrs.merge(
          role: "navigation",
          "aria-label": "pagination",
          "data-slot": "pagination",
          class: pagination_classes
        )
      end
    end
