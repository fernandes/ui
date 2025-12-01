# frozen_string_literal: true

require "tailwind_merge"

# GroupBehavior
#
# Shared behavior for SidebarGroup component.
module UI::SidebarGroupBehavior
  def sidebar_group_html_attributes
    {
      class: sidebar_group_classes,
      data: sidebar_group_data_attributes
    }
  end

  def sidebar_group_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      sidebar_group_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_group_data_attributes
    {
      slot: "sidebar-group"
    }
  end

  private

  def sidebar_group_base_classes
    "relative flex w-full min-w-0 flex-col p-2"
  end
end
