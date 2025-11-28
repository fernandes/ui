# frozen_string_literal: true

# UI::InputGroupInputBehavior
#
# Shared behavior for InputGroupInput component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation for input group inputs.
module UI::InputGroupInputBehavior
  # Returns HTML attributes for the input group input
  def input_group_input_html_attributes
    input_group_input_attributes
  end

  # Returns attributes to pass to the input component
  def input_group_input_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    # Merge data-slot to override the default "input" slot with "input-group-control"
    # For Phlex: merge at top level, for ERB/VC: merge inside attributes hash
    data_slot_override = { data: { slot: "input-group-control" } }

    # Merge the data-slot both at top level (for Phlex) and in attributes (for ERB/VC)
    merged_attrs = attributes_value.deep_merge(data_slot_override)

    {
      type: @type,
      placeholder: @placeholder,
      value: @value,
      name: @name,
      id: @id,
      classes: input_group_input_classes,
      attributes: merged_attrs
    }.compact.merge(data_slot_override)
  end

  # Returns combined CSS classes for the input
  def input_group_input_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      input_group_input_base_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes for input group input - removes border, shadow and adds flex-1
  def input_group_input_base_classes
    "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
  end
end
