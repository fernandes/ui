# frozen_string_literal: true

require "tailwind_merge"

    # SeparatorBehavior
    #
    # Shared behavior for SidebarSeparator component.
    module UI::SidebarSeparatorBehavior
      def sidebar_separator_html_attributes
        {
          class: sidebar_separator_classes,
          data: sidebar_separator_data_attributes,
          role: "separator"
        }
      end

      def sidebar_separator_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_separator_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_separator_data_attributes
        {
          slot: "sidebar-separator"
        }
      end

      private

      def sidebar_separator_base_classes
        "mx-2 w-auto bg-sidebar-border shrink-0 h-px"
      end
    end
