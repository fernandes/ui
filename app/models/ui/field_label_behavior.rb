# frozen_string_literal: true

module UI
  # FieldLabelBehavior
  #
  # Shared behavior for FieldLabel component across ERB, ViewComponent, and Phlex implementations.
  # FieldLabel provides styled labels for form fields with disability states.
  module FieldLabelBehavior
    # Returns HTML attributes for the field label element
    def field_label_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      {
        for: @for_id,
        "data-slot": "field-label",
        class: field_label_classes
      }.merge(attributes_value).compact
    end

    # Returns combined CSS classes for the field label
    def field_label_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      base = "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4 has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10"

      TailwindMerge::Merger.new.merge([base, classes_value].compact.join(" "))
    end
  end
end
