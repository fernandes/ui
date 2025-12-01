# frozen_string_literal: true

require "tailwind_merge"

# ItemBehavior
#
# Shared behavior for CommandItem component.
module UI::CommandItemBehavior
  def command_item_html_attributes
    attrs = {
      class: command_item_classes,
      data: command_item_data_attributes,
      role: "option",
      "aria-selected": "false"
    }
    attrs["aria-disabled"] = "true" if @disabled
    attrs
  end

  def command_item_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      command_item_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def command_item_data_attributes
    attrs = {
      slot: "command-item",
      ui__command_target: "item",
      action: "click->ui--command#select",
      value: @value || ""
    }
    attrs[:disabled] = "" if @disabled
    attrs
  end

  private

  def command_item_base_classes
    "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none " \
    "hover:bg-accent hover:text-accent-foreground " \
    "data-[disabled]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground " \
    "data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
  end
end
