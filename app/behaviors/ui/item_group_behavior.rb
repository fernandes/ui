# frozen_string_literal: true

# ItemGroupBehavior
#
# Shared behavior for Item group container across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::ItemGroupBehavior
  # Returns HTML attributes for the item group element
  def item_group_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: item_group_classes
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def item_group_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      item_group_base_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes for item group
  def item_group_base_classes
    ""
  end
end
