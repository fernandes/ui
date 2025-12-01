# frozen_string_literal: true

# UI::SelectLabelBehavior
#
# Shared behavior for Select group label across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::SelectLabelBehavior
  # Returns HTML attributes for the select label element
  def select_label_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: select_label_classes,
      data: {
        slot: "select-label" # ADDED: data-slot attribute
      }
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def select_label_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      select_label_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes for select label
  def select_label_base_classes
    "px-2 py-1.5 text-xs text-muted-foreground"
  end
end
