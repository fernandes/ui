# frozen_string_literal: true

# KbdGroupBehavior
#
# Shared behavior for KbdGroup component across ERB, ViewComponent, and Phlex implementations.
# Groups multiple keyboard keys together with consistent spacing.
module UI::KbdGroupBehavior
  # Returns HTML attributes for the kbd group element
  def kbd_group_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: kbd_group_classes,
      "data-slot": "kbd-group"
    }.merge(attributes_value).compact
  end

  # Returns combined CSS classes for the kbd group element
  def kbd_group_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    base = "inline-flex items-center gap-1"

    TailwindMerge::Merger.new.merge([base, classes_value].compact.join(" "))
  end
end
