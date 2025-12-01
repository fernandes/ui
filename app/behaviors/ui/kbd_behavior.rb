# frozen_string_literal: true

# UI::KbdBehavior
#
# @ui_component Kbd
# @ui_description Kbd - Phlex implementation
# @ui_category data-display
#
# @ui_anatomy Kbd - Displays textual user input from keyboard, helping users understand (required)
# @ui_anatomy Group - Groups multiple keyboard keys together with consistent spacing.
#
# @ui_feature Keyboard navigation
# @ui_feature Custom styling with Tailwind classes
#
module UI::KbdBehavior
  # Returns HTML attributes for the kbd element
  def kbd_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: kbd_classes,
      "data-slot": "kbd"
    }.merge(attributes_value).compact
  end

  # Returns combined CSS classes for the kbd element
  def kbd_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    base = "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none"
    svg_sizing = "[&_svg:not([class*='size-'])]:size-3"
    tooltip_styling = "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10"

    TailwindMerge::Merger.new.merge([base, svg_sizing, tooltip_styling, classes_value].compact.join(" "))
  end
end
