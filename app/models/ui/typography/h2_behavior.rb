# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Typography
    # Shared behavior for H2 component
    module H2Behavior
      # Base CSS classes for H2
      def h2_base_classes
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
      end

      # Merge base classes with custom classes using TailwindMerge
      def h2_classes
        TailwindMerge::Merger.new.merge([h2_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash
      def h2_html_attributes
        {
          class: h2_classes
        }
      end
    end
  end
end
