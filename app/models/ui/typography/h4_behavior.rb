# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Typography
    # Shared behavior for H4 component
    module H4Behavior
      # Base CSS classes for H4
      def h4_base_classes
        "scroll-m-20 text-xl font-semibold tracking-tight"
      end

      # Merge base classes with custom classes using TailwindMerge
      def h4_classes
        TailwindMerge::Merger.new.merge([h4_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash
      def h4_html_attributes
        {
          class: h4_classes
        }
      end
    end
  end
end
