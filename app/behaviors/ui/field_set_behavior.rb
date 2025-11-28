# frozen_string_literal: true

module UI
  # FieldSetBehavior
  #
  # Shared behavior for FieldSet component across ERB, ViewComponent, and Phlex implementations.
  # FieldSet provides semantic fieldset container for grouped fields.
  module FieldSetBehavior
    # Returns HTML attributes for the field set element
    def field_set_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      {
        "data-slot": "field-set",
        class: field_set_classes
      }.merge(attributes_value).compact
    end

    # Returns combined CSS classes for the field set
    def field_set_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      base = "flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3"

      TailwindMerge::Merger.new.merge([base, classes_value].compact.join(" "))
    end
  end
end
