# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sidebar
    # HeaderBehavior
    #
    # Shared behavior for SidebarHeader component.
    module HeaderBehavior
      def sidebar_header_html_attributes
        {
          class: sidebar_header_classes,
          data: sidebar_header_data_attributes
        }
      end

      def sidebar_header_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_header_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_header_data_attributes
        {
          slot: "sidebar-header"
        }
      end

      private

      def sidebar_header_base_classes
        "flex flex-col gap-2 p-2"
      end
    end
  end
end
