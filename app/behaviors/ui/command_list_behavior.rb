# frozen_string_literal: true

require "tailwind_merge"

# ListBehavior
#
# Shared behavior for CommandList component.
module UI::CommandListBehavior
  def command_list_html_attributes
    {
      class: command_list_classes,
      data: command_list_data_attributes,
      role: "listbox",
      tabindex: "-1" # Not focusable via Tab - navigation is via arrows in combobox input
    }
  end

  def command_list_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      command_list_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def command_list_data_attributes
    {
      slot: "command-list",
      ui__command_target: "list"
    }
  end

  private

  def command_list_base_classes
    "max-h-[300px] overflow-x-hidden overflow-y-auto outline-none"
  end
end
