# frozen_string_literal: true

require "tailwind_merge"

# InputBehavior
#
# Shared behavior for SidebarInput component.
module UI::SidebarInputBehavior
  def sidebar_input_html_attributes
    {
      class: sidebar_input_classes,
      data: sidebar_input_data_attributes
    }
  end

  def sidebar_input_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      sidebar_input_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def sidebar_input_data_attributes
    {
      slot: "sidebar-input"
    }
  end

  private

  def sidebar_input_base_classes
    "h-8 w-full bg-background shadow-none focus-visible:ring-2 " \
    "focus-visible:ring-sidebar-ring"
  end
end
