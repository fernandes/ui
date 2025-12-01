# frozen_string_literal: true

require "tailwind_merge"

# MenuSubBehavior
#
# Shared behavior for SidebarMenuSub component.
module UI::SidebarMenuSubBehavior
  def sidebar_menu_sub_html_attributes
    {
      class: sidebar_menu_sub_classes,
      data: sidebar_menu_sub_data_attributes
    }
  end

  def sidebar_menu_sub_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      sidebar_menu_sub_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_menu_sub_data_attributes
    {
      slot: "sidebar-menu-sub"
    }
  end

  private

  def sidebar_menu_sub_base_classes
    "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border " \
    "px-2.5 py-0.5 group-data-[state=collapsed]:group-data-[collapsible=icon]:hidden"
  end
end
