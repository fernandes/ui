# frozen_string_literal: true

require "tailwind_merge"

    # Shared behavior for Drawer Footer component
    # Action area for drawer (buttons, etc.)
    module UI::DrawerFooterBehavior
      # Base CSS classes for drawer footer
      def drawer_footer_base_classes
        "mt-auto flex flex-col gap-2 p-4"
      end

      # Merge base classes with custom classes using TailwindMerge
      def drawer_footer_classes
        TailwindMerge::Merger.new.merge([drawer_footer_base_classes, @classes].compact.join(" "))
      end

      # Build complete HTML attributes hash for footer
      def drawer_footer_html_attributes
        base_attrs = @attributes || {}
        base_attrs.merge(class: drawer_footer_classes)
      end
    end
