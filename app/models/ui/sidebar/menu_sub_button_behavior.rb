# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sidebar
    # MenuSubButtonBehavior
    #
    # Shared behavior for SidebarMenuSubButton component.
    module MenuSubButtonBehavior
      SIZES = {
        sm: "text-xs",
        md: "text-sm"
      }.freeze

      def sidebar_menu_sub_button_html_attributes
        {
          class: sidebar_menu_sub_button_classes,
          data: sidebar_menu_sub_button_data_attributes
        }
      end

      def sidebar_menu_sub_button_classes
        size_value = respond_to?(:size, true) ? size : @size
        is_active = respond_to?(:active, true) ? active : @active
        classes_value = respond_to?(:classes, true) ? classes : @classes

        TailwindMerge::Merger.new.merge([
          sidebar_menu_sub_button_base_classes,
          SIZES[size_value],
          is_active ? sidebar_menu_sub_button_active_classes : nil,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_menu_sub_button_data_attributes
        is_active = respond_to?(:active, true) ? active : @active
        attrs = {
          slot: "sidebar-menu-sub-button",
          size: @size
        }
        attrs[:active] = true if is_active
        attrs
      end

      private

      def sidebar_menu_sub_button_base_classes
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden " \
        "rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring " \
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground " \
        "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground " \
        "disabled:pointer-events-none disabled:opacity-50 " \
        "aria-disabled:pointer-events-none aria-disabled:opacity-50 " \
        "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground"
      end

      def sidebar_menu_sub_button_active_classes
        "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      end
    end
  end
end
