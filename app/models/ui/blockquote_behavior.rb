# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Blockquote component
    module UI::BlockquoteBehavior
      # Base CSS classes for Blockquote
      def blockquote_base_classes
        "mt-6 border-l-2 pl-6 italic"
      end

      # Merge base classes with custom classes using TailwindMerge
      def blockquote_classes
        TailwindMerge::Merger.new.merge([blockquote_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash
      def blockquote_html_attributes
        {
          class: blockquote_classes
        }
      end
    end
