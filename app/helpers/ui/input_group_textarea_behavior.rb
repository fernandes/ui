# frozen_string_literal: true

# UI::InputGroupTextareaBehavior
#
# Shared behavior for InputGroupTextarea component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation for input group textareas.
module UI::InputGroupTextareaBehavior
  # Returns HTML attributes for the input group textarea
  def input_group_textarea_html_attributes
    input_group_textarea_attributes
  end

  # Returns attributes to pass to the textarea component
  def input_group_textarea_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    # Merge data-slot to override the default textarea slot with "input-group-control"
    # For Phlex: merge at top level, for ERB/VC: merge inside attributes hash
    data_slot_override = {data: {slot: "input-group-control"}}

    # Merge the data-slot both at top level (for Phlex) and in attributes (for ERB/VC)
    merged_attrs = attributes_value.deep_merge(data_slot_override)

    {
      placeholder: @placeholder,
      value: @value,
      name: @name,
      id: @id,
      rows: @rows,
      classes: input_group_textarea_classes,
      attributes: merged_attrs
    }.compact.merge(data_slot_override)
  end

  # Returns combined CSS classes for the textarea
  def input_group_textarea_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      input_group_textarea_base_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes for input group textarea - removes border, shadow and adds flex-1
  def input_group_textarea_base_classes
    "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent"
  end
end
