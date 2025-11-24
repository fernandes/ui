# frozen_string_literal: true

module UI
  # FieldGroupBehavior
  #
  # Shared behavior for FieldGroup component across ERB, ViewComponent, and Phlex implementations.
  # FieldGroup is a layout wrapper that stacks Field components.
  module FieldGroupBehavior
    # Returns HTML attributes for the field group wrapper element
    def field_group_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      {
        "data-slot": "field-group",
        class: field_group_classes
      }.merge(attributes_value).compact
    end

    # Returns combined CSS classes for the field group
    def field_group_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      base = "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4"

      TailwindMerge::Merger.new.merge([base, classes_value].compact.join(" "))
    end
  end
end
