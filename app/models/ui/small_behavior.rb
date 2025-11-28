# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Small component
    module UI::SmallBehavior
      # Base CSS classes for Small
      def small_base_classes
        "text-sm font-medium leading-none"
      end

      # Merge base classes with custom classes using TailwindMerge
      def small_classes
        TailwindMerge::Merger.new.merge([small_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash
      def small_html_attributes
        {
          class: small_classes
        }
      end
    end
