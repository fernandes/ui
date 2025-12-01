# frozen_string_literal: true

require "tailwind_merge"

# UI::SidebarMenuBadgeBehavior
#
# @ui_component Sidebar Menu Badge
# @ui_description MenuBadge - Phlex implementation
# @ui_category other
#
# @ui_anatomy Sidebar Menu Badge - Badge that appears at the end of a menu button. (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::SidebarMenuBadgeBehavior
  def sidebar_menu_badge_html_attributes
    {
      class: sidebar_menu_badge_classes,
      data: sidebar_menu_badge_data_attributes
    }
  end

  def sidebar_menu_badge_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      sidebar_menu_badge_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_menu_badge_data_attributes
    {
      slot: "sidebar-menu-badge"
    }
  end

  private

  def sidebar_menu_badge_base_classes
    "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none " \
    "items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums " \
    "text-sidebar-foreground peer-hover/menu-button:text-sidebar-accent-foreground " \
    "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground " \
    "group-data-[state=collapsed]:group-data-[collapsible=icon]:hidden"
  end
end
