# frozen_string_literal: true

module UI
  # FieldErrorBehavior
  #
  # Shared behavior for FieldError component across ERB, ViewComponent, and Phlex implementations.
  # FieldError displays error messages for form fields with accessibility support.
  module FieldErrorBehavior
    # Returns HTML attributes for the field error element
    def field_error_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      {
        "data-slot": "field-error",
        class: field_error_classes,
        role: "alert"
      }.merge(attributes_value).compact
    end

    # Returns combined CSS classes for the field error
    def field_error_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      base = "text-destructive text-sm font-normal"

      TailwindMerge::Merger.new.merge([base, classes_value].compact.join(" "))
    end

    # Returns true if errors should be displayed
    def has_errors?
      @errors.is_a?(Array) && @errors.any?
    end

    # Returns true if displaying a single error
    def single_error?
      has_errors? && @errors.length == 1
    end

    # Returns true if displaying multiple errors
    def multiple_errors?
      has_errors? && @errors.length > 1
    end

    # Returns error message from error object (supports Hash or String)
    def error_message(error)
      error.is_a?(Hash) ? error[:message] : error
    end
  end
end
