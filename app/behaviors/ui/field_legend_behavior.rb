# frozen_string_literal: true

# UI::FieldLegendBehavior
#
# @ui_component Field Legend
# @ui_description Legend - Phlex implementation
# @ui_category other
#
# @ui_anatomy Field Legend - Legend element for FieldSet with variant support. (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::FieldLegendBehavior
  # Returns HTML attributes for the field legend element
  def field_legend_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    variant_value = @variant.to_s.presence || "legend"
    {
      "data-slot": "field-legend",
      "data-variant": variant_value,
      class: field_legend_classes
    }.merge(attributes_value).compact
  end

  # Returns combined CSS classes for the field legend
  def field_legend_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    base = "mb-3 font-medium data-[variant=legend]:text-base data-[variant=label]:text-sm"

    TailwindMerge::Merger.new.merge([base, classes_value].compact.join(" "))
  end
end
