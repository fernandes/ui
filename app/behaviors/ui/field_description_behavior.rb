# frozen_string_literal: true

# FieldDescriptionBehavior
#
# Shared behavior for FieldDescription component across ERB, ViewComponent, and Phlex implementations.
# FieldDescription provides helper text for form fields.
module UI::FieldDescriptionBehavior
  # Returns HTML attributes for the field description element
  def field_description_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      "data-slot": "field-description",
      class: field_description_classes
    }.merge(attributes_value).compact
  end

  # Returns combined CSS classes for the field description
  def field_description_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    base = "text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5 [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4"

    TailwindMerge::Merger.new.merge([base, classes_value].compact.join(" "))
  end
end
