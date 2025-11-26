# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sidebar
    # MenuActionBehavior
    #
    # Shared behavior for SidebarMenuAction component.
    module MenuActionBehavior
      def sidebar_menu_action_html_attributes
        {
          class: sidebar_menu_action_classes,
          data: sidebar_menu_action_data_attributes
        }
      end

      def sidebar_menu_action_classes
        show_on_hover = respond_to?(:show_on_hover, true) ? show_on_hover : @show_on_hover
        classes_value = respond_to?(:classes, true) ? classes : @classes

        TailwindMerge::Merger.new.merge([
          sidebar_menu_action_base_classes,
          show_on_hover ? sidebar_menu_action_show_on_hover_classes : nil,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_menu_action_data_attributes
        {
          slot: "sidebar-menu-action"
        }
      end

      private

      def sidebar_menu_action_base_classes
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center " \
        "rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring " \
        "transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground " \
        "focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground " \
        "[&>svg]:size-4 [&>svg]:shrink-0 after:absolute after:-inset-2 after:md:hidden " \
        "group-data-[state=collapsed]:group-data-[collapsible=icon]:hidden"
      end

      def sidebar_menu_action_show_on_hover_classes
        "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 " \
        "data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground " \
        "md:opacity-0"
      end
    end
  end
end
