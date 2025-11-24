# frozen_string_literal: true

module UI
  # FieldBehavior
  #
  # Shared behavior for Field component across ERB, ViewComponent, and Phlex implementations.
  # Field is the core wrapper for a single form field with support for different orientations.
  module FieldBehavior
    # Returns HTML attributes for the field wrapper element
    def field_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      {
        role: "group",
        class: field_classes,
        "data-slot": "field",
        "data-orientation": @orientation,
        "data-invalid": @data_invalid
      }.merge(attributes_value).compact
    end

    # Returns combined CSS classes for the field
    def field_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      base = "group/field flex w-full gap-3 data-[invalid=true]:text-destructive"
      orientation = field_orientation_classes

      TailwindMerge::Merger.new.merge([base, orientation, classes_value].compact.join(" "))
    end

    private

    # Returns orientation-specific classes
    def field_orientation_classes
      case @orientation.to_s
      when "vertical"
        "flex-col [&>*]:w-full [&>.sr-only]:w-auto"
      when "horizontal"
        "flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
      when "responsive"
        "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
      else
        "flex-col [&>*]:w-full [&>.sr-only]:w-auto"
      end
    end
  end
end
