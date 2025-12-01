# frozen_string_literal: true

# UI::SelectTriggerBehavior
#
# Shared behavior for Select trigger button across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::SelectTriggerBehavior
  # Returns HTML attributes for the select trigger element
  def select_trigger_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      type: "button",
      role: "combobox",
      "aria-expanded": "false",
      "aria-haspopup": "listbox",
      class: select_trigger_classes,
      data: {
        ui__select_target: "trigger",
        action: "click->ui--select#toggle",
        slot: "select-trigger"
      }
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def select_trigger_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      select_trigger_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes for select trigger
  def select_trigger_base_classes
    "inline-flex h-9 w-full items-center justify-between gap-2 whitespace-nowrap rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background transition-[color,box-shadow] outline-none focus:ring-1 focus:ring-ring focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2224%22%20height%3d%2224%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22currentColor%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpath%20d%3d%22m6%209%206%206%206-6%22%2f%3e%3c%2fsvg%3e')] bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 data-[placeholder]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
  end
end
