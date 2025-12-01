# frozen_string_literal: true

# ItemFooterBehavior
#
# Shared behavior for Item footer section across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::ItemFooterBehavior
  # Returns HTML attributes for the item footer element
  def item_footer_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: item_footer_classes
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def item_footer_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      item_footer_base_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes for item footer (from shadcn/ui v4)
  def item_footer_base_classes
    "flex w-full items-center justify-between pt-2"
  end
end
