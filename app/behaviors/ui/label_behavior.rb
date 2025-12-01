# frozen_string_literal: true

require "tailwind_merge"

# UI::LabelBehavior
#
# @ui_component Label
# @ui_description Label - Phlex implementation
# @ui_category forms
#
# @ui_anatomy Label - Accessible label for form inputs following shadcn/ui design patterns. (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Form integration
# @ui_feature Disabled state support
#
# @ui_related field
# @ui_related input
#
module UI::LabelBehavior
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
