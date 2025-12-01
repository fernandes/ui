# frozen_string_literal: true

require "tailwind_merge"

# GroupLabelBehavior
#
# Shared behavior for SidebarGroupLabel component.
module UI::SidebarGroupLabelBehavior
  def sidebar_group_label_html_attributes
    {
      class: sidebar_group_label_classes,
      data: sidebar_group_label_data_attributes
    }
  end

  def sidebar_group_label_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      sidebar_group_label_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_group_label_data_attributes
    {
      slot: "sidebar-group-label"
    }
  end

  private

  def sidebar_group_label_base_classes
    "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium " \
    "text-sidebar-foreground/70 outline-none ring-sidebar-ring " \
    "transition-[margin,opacity] duration-200 ease-linear " \
    "focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 " \
    "group-data-[state=collapsed]:group-data-[collapsible=icon]:-mt-8 group-data-[state=collapsed]:group-data-[collapsible=icon]:opacity-0"
  end
end
