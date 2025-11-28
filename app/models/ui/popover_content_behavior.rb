# frozen_string_literal: true

# PopoverContentBehavior
#
# Shared behavior for PopoverContent component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation.
module UI::PopoverContentBehavior
  # Returns HTML attributes for the popover content element
  def popover_content_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: popover_content_classes,
      data: popover_content_data_attributes
    }.merge(attributes_value)
  end

  # Returns combined CSS classes for the popover content
  def popover_content_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      popover_content_base_classes,
      classes_value

    ].compact.join(" "))
  end

  # Returns data attributes for the popover content
  def popover_content_data_attributes
    {
      ui__popover_target: "content",
      state: "closed",
    }
  end

  private

  # Base classes from shadcn/ui - exact match
  # Note: Positioning classes like origin-(--ui-popover-content-transform-origin)
  # will be handled by our Stimulus controller for positioning
  def popover_content_base_classes
    "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:invisible data-[state=open]:visible data-[state=open]:pointer-events-auto data-[state=closed]:pointer-events-none absolute top-0 left-0 z-50 w-72 rounded-md border p-4 shadow-md outline-hidden"
  end

  # Calculate placement value from side and align
  def placement_value
    if @align == "center"
      @side
    else
      "#{@side}-#{@align}"
    end
  end
end
