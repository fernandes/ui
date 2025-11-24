# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Typography
    # Shared behavior for H1 component
    module H1Behavior
      # Base CSS classes for H1
      def h1_base_classes
        "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance"
      end

      # Merge base classes with custom classes using TailwindMerge
      def h1_classes
        TailwindMerge::Merger.new.merge([h1_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash
      def h1_html_attributes
        {
          class: h1_classes
        }
      end
    end
  end
end
