# frozen_string_literal: true

require "tailwind_merge"

    # FooterBehavior
    #
    # Shared behavior for SidebarFooter component.
    module UI::SidebarFooterBehavior
      def sidebar_footer_html_attributes
        {
          class: sidebar_footer_classes,
          data: sidebar_footer_data_attributes
        }
      end

      def sidebar_footer_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_footer_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_footer_data_attributes
        {
          slot: "sidebar-footer"
        }
      end

      private

      def sidebar_footer_base_classes
        "flex flex-col gap-2 p-2 mt-auto"
      end
    end
