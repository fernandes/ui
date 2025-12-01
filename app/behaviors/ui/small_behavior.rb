# frozen_string_literal: true

require "tailwind_merge"

# UI::SmallBehavior
#
# @ui_component Small
# @ui_category typography
#
# @ui_anatomy Small - Small component part (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::SmallBehavior
  # Base CSS classes for Small
  def small_base_classes
    "text-sm font-medium leading-none"
  end

  # Merge base classes with custom classes using TailwindMerge
  def small_classes
    TailwindMerge::Merger.new.merge([small_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash
  def small_html_attributes
    {
      class: small_classes
    }
  end
end
