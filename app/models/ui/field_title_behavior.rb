# frozen_string_literal: true

module UI
  # FieldTitleBehavior
  #
  # Shared behavior for FieldTitle component across ERB, ViewComponent, and Phlex implementations.
  # FieldTitle provides title with label styling inside FieldContent.
  module FieldTitleBehavior
    # Returns HTML attributes for the field title element
    def field_title_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      {
        "data-slot": "field-label",
        class: field_title_classes
      }.merge(attributes_value).compact
    end

    # Returns combined CSS classes for the field title
    def field_title_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      base = "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50"

      TailwindMerge::Merger.new.merge([base, classes_value].compact.join(" "))
    end
  end
end
