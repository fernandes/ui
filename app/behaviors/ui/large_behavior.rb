# frozen_string_literal: true

require "tailwind_merge"

# UI::LargeBehavior
#
# @ui_component Large
# @ui_category typography
#
# @ui_anatomy Large - Large component part (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::LargeBehavior
  # Base CSS classes for Large
  def large_base_classes
    "text-lg font-semibold"
  end

  # Merge base classes with custom classes using TailwindMerge
  def large_classes
    TailwindMerge::Merger.new.merge([large_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash
  def large_html_attributes
    {
      class: large_classes
    }
  end
end
