# frozen_string_literal: true

require "tailwind_merge"

# GroupActionBehavior
#
# Shared behavior for SidebarGroupAction component.
module UI::SidebarGroupActionBehavior
  def sidebar_group_action_html_attributes
    {
      class: sidebar_group_action_classes,
      data: sidebar_group_action_data_attributes
    }
  end

  def sidebar_group_action_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      sidebar_group_action_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_group_action_data_attributes
    {
      slot: "sidebar-group-action"
    }
  end

  private

  def sidebar_group_action_base_classes
    "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center " \
    "rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring " \
    "transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground " \
    "focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 " \
    "after:absolute after:-inset-2 after:md:hidden " \
    "group-data-[state=collapsed]:group-data-[collapsible=icon]:hidden"
  end
end
