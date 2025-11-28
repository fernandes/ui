# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for P component
    module UI::PBehavior
      # Base CSS classes for P
      def p_base_classes
        "leading-7 [&:not(:first-child)]:mt-6"
      end

      # Merge base classes with custom classes using TailwindMerge
      def p_classes
        TailwindMerge::Merger.new.merge([p_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash
      def p_html_attributes
        {
          class: p_classes
        }
      end
    end
