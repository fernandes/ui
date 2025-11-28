# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Muted component
    module UI::MutedBehavior
      # Base CSS classes for Muted
      def muted_base_classes
        "text-sm text-muted-foreground"
      end

      # Merge base classes with custom classes using TailwindMerge
      def muted_classes
        TailwindMerge::Merger.new.merge([muted_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash
      def muted_html_attributes
        {
          class: muted_classes
        }
      end
    end
