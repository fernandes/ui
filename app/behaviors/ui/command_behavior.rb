# frozen_string_literal: true

require "tailwind_merge"

# UI::CommandBehavior
#
# @ui_component Command
# @ui_category data-display
#
# @ui_anatomy Command - Root container for command palette (required)
# @ui_anatomy Empty - Content shown when no items
# @ui_anatomy Group - Container for grouping related items
# @ui_anatomy Input - Text input field
# @ui_anatomy Item - Individual item element
# @ui_anatomy List - Container for list items
# @ui_anatomy Separator - Visual divider between sections
# @ui_anatomy Shortcut - Keyboard shortcut indicator
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Keyboard navigation with arrow keys
#
# @ui_aria_pattern Listbox
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
#
# @ui_keyboard Enter Activates the focused element
# @ui_keyboard ArrowDown Moves focus to next item
# @ui_keyboard ArrowUp Moves focus to previous item
# @ui_keyboard Home Moves focus to first item
# @ui_keyboard End Moves focus to last item
#
# @ui_related combobox
# @ui_related dialog
#
module UI::CommandBehavior
  def command_html_attributes
    {
      class: command_classes,
      data: command_data_attributes
    }
  end

  def command_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      command_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def command_data_attributes
    {
      controller: "ui--command",
      slot: "command",
      ui__command_loop_value: @loop.to_s
    }
  end

  private

  def command_base_classes
    "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md"
  end
end
