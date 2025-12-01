# frozen_string_literal: true

require "tailwind_merge"

# MenuSubItemBehavior
#
# Shared behavior for SidebarMenuSubItem component.
module UI::SidebarMenuSubItemBehavior
  def sidebar_menu_sub_item_html_attributes
    {
      class: sidebar_menu_sub_item_classes,
      data: sidebar_menu_sub_item_data_attributes
    }
  end

  def sidebar_menu_sub_item_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      sidebar_menu_sub_item_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_menu_sub_item_data_attributes
    {
      slot: "sidebar-menu-sub-item"
    }
  end

  private

  def sidebar_menu_sub_item_base_classes
    ""
  end
end
