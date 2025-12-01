# frozen_string_literal: true

require "tailwind_merge"

# UI::SidebarMenuButtonBehavior
#
# @ui_component Sidebar Menu Button
# @ui_description MenuButton - Phlex implementation
# @ui_category other
#
# @ui_anatomy Sidebar Menu Button - Interactive button within a sidebar menu item. (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Disabled state support
# @ui_feature ARIA attributes for accessibility
#
module UI::SidebarMenuButtonBehavior
  VARIANTS = {
    default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] " \
             "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
  }.freeze

  SIZES = {
    default: "h-8 text-sm",
    sm: "h-7 text-xs",
    lg: "h-12 text-sm group-data-[state=collapsed]:group-data-[collapsible=icon]:p-0!"
  }.freeze

  def sidebar_menu_button_html_attributes
    {
      class: sidebar_menu_button_classes,
      data: sidebar_menu_button_data_attributes
    }
  end

  def sidebar_menu_button_classes
    variant_value = respond_to?(:variant, true) ? variant : @variant
    size_value = respond_to?(:size, true) ? size : @size
    is_active = respond_to?(:active, true) ? active : @active
    classes_value = respond_to?(:classes, true) ? classes : @classes

    TailwindMerge::Merger.new.merge([
      sidebar_menu_button_base_classes,
      VARIANTS[variant_value],
      SIZES[size_value],
      is_active ? sidebar_menu_button_active_classes : nil,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_menu_button_data_attributes
    is_active = respond_to?(:active, true) ? active : @active
    attrs = {
      slot: "sidebar-menu-button",
      size: @size
    }
    attrs[:active] = true if is_active
    attrs
  end

  private

  def sidebar_menu_button_base_classes
    "group peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 " \
    "text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] " \
    "focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground " \
    "disabled:pointer-events-none disabled:opacity-50 group-has-[[data-slot=sidebar-menu-action]]/menu-item:pr-8 " \
    "aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent " \
    "data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground " \
    "data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground " \
    "group-data-[state=collapsed]:group-data-[collapsible=icon]:size-8! " \
    "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
  end

  def sidebar_menu_button_active_classes
    "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
  end
end
