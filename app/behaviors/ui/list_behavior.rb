# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for List component
    module UI::ListBehavior
      # Base CSS classes for List (ul)
      def list_base_classes
        "my-6 ml-6 list-disc [&>li]:mt-2"
      end

      # Merge base classes with custom classes using TailwindMerge
      def list_classes
        TailwindMerge::Merger.new.merge([list_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash
      def list_html_attributes
        {
          class: list_classes
        }
      end
    end
