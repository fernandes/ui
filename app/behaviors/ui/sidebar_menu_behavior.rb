# frozen_string_literal: true

require "tailwind_merge"

# UI::SidebarMenuBehavior
#
# @ui_component Sidebar Menu
# @ui_description Menu - Phlex implementation
# @ui_category other
#
# @ui_anatomy Sidebar Menu - List container for sidebar menu items. (required)
# @ui_anatomy Action - Action button within a sidebar menu item, appears on hover/focus.
# @ui_anatomy Item - List item container for a sidebar menu entry.
# @ui_anatomy Sub - Nested submenu container for hierarchical navigation.
# @ui_anatomy Sub Item - List item container for a sidebar submenu entry.
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::SidebarMenuBehavior
  def sidebar_menu_html_attributes
    {
      class: sidebar_menu_classes,
      data: sidebar_menu_data_attributes
    }
  end

  def sidebar_menu_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      sidebar_menu_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_menu_data_attributes
    {
      slot: "sidebar-menu"
    }
  end

  private

  def sidebar_menu_base_classes
    "flex w-full min-w-0 flex-col gap-1"
  end
end
