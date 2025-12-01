# frozen_string_literal: true

require "tailwind_merge"

# UI::H3Behavior
#
# @ui_component H3
# @ui_category typography
#
# @ui_anatomy H3 - H3 component part (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::H3Behavior
  # Base CSS classes for H3
  def h3_base_classes
    "scroll-m-20 text-2xl font-semibold tracking-tight"
  end

  # Merge base classes with custom classes using TailwindMerge
  def h3_classes
    TailwindMerge::Merger.new.merge([h3_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash
  def h3_html_attributes
    {
      class: h3_classes
    }
  end
end
