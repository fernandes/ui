# frozen_string_literal: true

module UI
  # FieldSeparatorBehavior
  #
  # Shared behavior for FieldSeparator component across ERB, ViewComponent, and Phlex implementations.
  # FieldSeparator provides visual divider to separate sections inside FieldGroup.
  module FieldSeparatorBehavior
    # Returns HTML attributes for the field separator element
    def field_separator_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      has_content = has_content?
      {
        "data-slot": "field-separator",
        "data-content": has_content ? "true" : nil,
        class: field_separator_classes
      }.merge(attributes_value).compact
    end

    # Returns combined CSS classes for the field separator
    def field_separator_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      base = "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2"

      TailwindMerge::Merger.new.merge([base, classes_value].compact.join(" "))
    end

    # Returns true if separator has content (text/label)
    def has_content?
      @content.present? || (@block_given if defined?(@block_given))
    end
  end
end
