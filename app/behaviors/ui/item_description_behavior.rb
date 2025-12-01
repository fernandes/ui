# frozen_string_literal: true

# ItemDescriptionBehavior
#
# Shared behavior for Item description text across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::ItemDescriptionBehavior
  # Returns HTML attributes for the item description element
  def item_description_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: item_description_classes
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def item_description_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      item_description_base_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes for item description (from shadcn/ui v4)
  def item_description_base_classes
    "line-clamp-2 text-sm text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2"
  end
end
