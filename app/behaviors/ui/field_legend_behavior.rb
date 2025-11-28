# frozen_string_literal: true

module UI
  # FieldLegendBehavior
  #
  # Shared behavior for FieldLegend component across ERB, ViewComponent, and Phlex implementations.
  # FieldLegend provides legend element for FieldSet with variant support.
  module FieldLegendBehavior
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
end
