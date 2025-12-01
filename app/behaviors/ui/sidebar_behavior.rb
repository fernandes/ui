# frozen_string_literal: true

require "tailwind_merge"

# UI::SidebarBehavior
#
# @ui_component Sidebar
# @ui_description Sidebar - Phlex implementation
# @ui_category navigation
#
# @ui_anatomy Sidebar - Main sidebar container with support for variants and collapsible modes. (required)
# @ui_anatomy Content - Scrollable content area in the middle of the sidebar. (required)
# @ui_anatomy Footer - Fixed footer section at the bottom of the sidebar.
# @ui_anatomy Group - Container for grouping related sidebar items.
# @ui_anatomy Group Action - Action button within a sidebar group header.
# @ui_anatomy Group Content - Container for content within a sidebar group. (required)
# @ui_anatomy Header - Fixed header section at the top of the sidebar.
# @ui_anatomy Input - Input field styled for sidebar usage.
# @ui_anatomy Separator - Visual divider within the sidebar.
# @ui_anatomy Trigger - Button that toggles the sidebar open/closed. (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::SidebarBehavior
  def sidebar_html_attributes
    {
      class: sidebar_classes,
      data: sidebar_data_attributes
    }
  end

  def sidebar_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      sidebar_base_classes,
      sidebar_variant_classes,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_data_attributes
    {
      slot: "sidebar",
      variant: @variant,
      side: @side,
      collapsible: @collapsible,
      ui__sidebar_target: "sidebar"
    }
  end

  private

  def sidebar_base_classes
    # Base classes for the sidebar container
    # Using group to allow child components to respond to sidebar state
    "group peer"
  end

  def sidebar_variant_classes
    case @variant.to_s
    when "floating"
      sidebar_floating_classes
    when "inset"
      sidebar_inset_classes
    else
      sidebar_default_classes
    end
  end

  def sidebar_default_classes
    # Default sidebar variant - fixed position with border
    # When expanded: full width
    # When collapsed + icon mode: icon width
    # When collapsed + offcanvas mode: width 0
    "hidden md:flex flex-col bg-sidebar text-sidebar-foreground " \
    "w-[var(--sidebar-width)] h-svh border-r border-sidebar-border " \
    "transition-[width] duration-[var(--duration-sidebar)] ease-[var(--ease-sidebar)] " \
    "group-data-[state=collapsed]:group-data-[collapsible=offcanvas]:w-0 " \
    "group-data-[state=collapsed]:group-data-[collapsible=offcanvas]:border-r-0 " \
    "group-data-[state=collapsed]:group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] " \
    "group-data-[side=right]:border-l group-data-[side=right]:border-r-0"
  end

  def sidebar_floating_classes
    # Floating variant - with margin, rounded corners, and shadow
    "hidden md:flex flex-col bg-sidebar text-sidebar-foreground " \
    "w-[var(--sidebar-width)] h-[calc(100svh-calc(var(--spacing)*4))] " \
    "m-2 rounded-lg border border-sidebar-border shadow " \
    "transition-[width] duration-[var(--duration-sidebar)] ease-[var(--ease-sidebar)] " \
    "group-data-[state=collapsed]:group-data-[collapsible=offcanvas]:w-0 " \
    "group-data-[state=collapsed]:group-data-[collapsible=offcanvas]:border-0 " \
    "group-data-[state=collapsed]:group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
  end

  def sidebar_inset_classes
    # Inset variant - appears inset within the layout
    "hidden md:flex flex-col bg-sidebar text-sidebar-foreground " \
    "w-[var(--sidebar-width)] h-svh " \
    "transition-[width] duration-[var(--duration-sidebar)] ease-[var(--ease-sidebar)] " \
    "group-data-[state=collapsed]:group-data-[collapsible=offcanvas]:w-0 " \
    "group-data-[state=collapsed]:group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
  end
end
