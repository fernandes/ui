# frozen_string_literal: true

require "tailwind_merge"

    # GroupContentBehavior
    #
    # Shared behavior for SidebarGroupContent component.
    module UI::SidebarGroupContentBehavior
      def sidebar_group_content_html_attributes
        {
          class: sidebar_group_content_classes,
          data: sidebar_group_content_data_attributes
        }
      end

      def sidebar_group_content_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_group_content_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_group_content_data_attributes
        {
          slot: "sidebar-group-content"
        }
      end

      private

      def sidebar_group_content_base_classes
        "w-full text-sm"
      end
    end
