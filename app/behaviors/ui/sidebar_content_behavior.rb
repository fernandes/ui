# frozen_string_literal: true

require "tailwind_merge"

# ContentBehavior
#
# Shared behavior for SidebarContent component.
module UI::SidebarContentBehavior
  def sidebar_content_html_attributes
    {
      class: sidebar_content_classes,
      data: sidebar_content_data_attributes
    }
  end

  def sidebar_content_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      sidebar_content_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_content_data_attributes
    {
      slot: "sidebar-content"
    }
  end

  private

  def sidebar_content_base_classes
    "flex min-h-0 flex-1 flex-col gap-2 overflow-auto " \
    "group-data-[state=collapsed]:group-data-[collapsible=icon]:overflow-hidden"
  end
end
