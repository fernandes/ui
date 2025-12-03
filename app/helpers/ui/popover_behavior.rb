# frozen_string_literal: true

# PopoverBehavior
#
# Shared behavior for Popover component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation.
module UI::PopoverBehavior
  # Returns HTML attributes for the popover container element
  def popover_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    user_data = attributes_value[:data] || {}
    other_attributes = attributes_value.except(:data)

    {
      class: popover_classes,
      data: popover_data_attributes.merge(user_data)
    }.merge(other_attributes)
  end

  # Returns combined CSS classes for the popover
  def popover_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      popover_base_classes,
      classes_value

    ].compact.join(" "))
  end

  # Returns data attributes for the popover controller
  def popover_data_attributes
    {
      controller: "ui--popover",
      ui__popover_placement_value: normalized_placement,
      ui__popover_offset_value: @offset,
      ui__popover_trigger_value: @trigger,
      ui__popover_hover_delay_value: @hover_delay
    }
  end

  private

  # Base classes applied to all popovers - relative positioning for absolute content
  def popover_base_classes
    "relative inline-block"
  end

  # Normalize placement from legacy align parameter
  def normalized_placement
    # If we have a legacy align parameter, convert it to placement
    if @align && @align != "center"
      "bottom-#{@align}"
    else
      @placement
    end
  end
end
