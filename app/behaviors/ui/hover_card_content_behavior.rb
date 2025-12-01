# frozen_string_literal: true

# Shared behavior for HoverCardContent component
# Provides HTML attributes and styling for the content element
module UI::HoverCardContentBehavior
  # Returns HTML attributes for the hover card content element
  def content_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: content_classes,
      data: content_data_attributes
    }.merge(attributes_value)
  end

  # Returns combined CSS classes for the hover card content
  def content_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      content_base_classes,
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for the hover card content
  def content_data_attributes
    {
      ui__hover_card_target: "content",
      align: @align,
      side_offset: @side_offset,
      action: "mouseenter->ui--hover-card#keepOpen mouseleave->ui--hover-card#scheduleHide"
    }
  end

  private

  # Base classes from shadcn/ui - exact match for hover card content
  # These match the Hover Card content styling from shadcn
  def content_base_classes
    "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 rounded-md border p-4 shadow-md outline-hidden invisible"
  end
end
