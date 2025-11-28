# frozen_string_literal: true

require "tailwind_merge"

module UI
  # LabelBehavior
  #
  # Shared behavior for Label component across ERB, ViewComponent, and Phlex implementations.
  # This module provides consistent styling and HTML attribute generation for form labels.
  module LabelBehavior
    # Returns HTML attributes for the label element
    def label_html_attributes
      {
        for: @for_id,
        class: label_classes
      }.compact
    end

    # Returns combined CSS classes for the label
    def label_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        label_base_classes,
        classes_value
      ].compact.join(" "))
    end

    private

    # Base classes applied to all labels (from shadcn/ui)
    def label_base_classes
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
    end
  end
end
