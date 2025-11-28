# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Drawer Title component
    # ARIA-compliant heading for drawer
    module UI::DrawerTitleBehavior
      # Base CSS classes for drawer title
      def drawer_title_base_classes
        "text-foreground font-semibold"
      end

      # Merge base classes with custom classes using TailwindMerge
      def drawer_title_classes
        TailwindMerge::Merger.new.merge([drawer_title_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for title
      def drawer_title_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(
          class: drawer_title_classes,
          role: "heading"
        )
      end
    end
