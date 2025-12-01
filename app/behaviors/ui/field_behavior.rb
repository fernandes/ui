# frozen_string_literal: true

# UI::FieldBehavior
#
# @ui_component Field
# @ui_description Field - Phlex implementation
# @ui_category forms
#
# @ui_anatomy Field - Core wrapper for a single form field with support for different orientations. (required)
# @ui_anatomy Content - Flex column that groups control and descriptions. (required)
# @ui_anatomy Description - Helper text for form fields.
# @ui_anatomy Group - Layout wrapper that stacks Field components.
# @ui_anatomy Label - Label styled for form fields with disability states.
# @ui_anatomy Separator - Visual divider to separate sections inside FieldGroup.
# @ui_anatomy Title - Title with label styling inside FieldContent.
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Form integration
#
# @ui_related input
# @ui_related label
#
module UI::FieldBehavior
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
