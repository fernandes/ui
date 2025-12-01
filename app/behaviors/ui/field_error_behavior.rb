# frozen_string_literal: true

# UI::FieldErrorBehavior
#
# @ui_component Field Error
# @ui_description Error - Phlex implementation
# @ui_category other
#
# @ui_anatomy Field Error - Error message display for form fields with accessibility support. (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Form integration
#
module UI::FieldErrorBehavior
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
