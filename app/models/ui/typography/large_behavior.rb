# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Typography
    # Shared behavior for Large component
    module LargeBehavior
      # Base CSS classes for Large
      def large_base_classes
        "text-lg font-semibold"
      end

      # Merge base classes with custom classes using TailwindMerge
      def large_classes
        TailwindMerge::Merger.new.merge([large_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash
      def large_html_attributes
        {
          class: large_classes
        }
      end
    end
  end
end
