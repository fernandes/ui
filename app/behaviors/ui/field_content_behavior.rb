# frozen_string_literal: true

# FieldContentBehavior
#
# Shared behavior for FieldContent component across ERB, ViewComponent, and Phlex implementations.
# FieldContent is a flex column that groups control and descriptions.
module UI::FieldContentBehavior
  # Returns HTML attributes for the field content wrapper element
  def field_content_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      "data-slot": "field-content",
      class: field_content_classes
    }.merge(attributes_value).compact
  end

  # Returns combined CSS classes for the field content
  def field_content_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    base = "group/field-content flex flex-1 flex-col gap-1.5 leading-snug"

    TailwindMerge::Merger.new.merge([base, classes_value].compact.join(" "))
  end
end
