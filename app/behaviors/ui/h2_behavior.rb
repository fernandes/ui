# frozen_string_literal: true

require "tailwind_merge"

# UI::H2Behavior
#
# @ui_component H2
# @ui_category typography
#
# @ui_anatomy H2 - H2 component part (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::H2Behavior
  # Base CSS classes for H2
  def h2_base_classes
    "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
  end

  # Merge base classes with custom classes using TailwindMerge
  def h2_classes
    TailwindMerge::Merger.new.merge([h2_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash
  def h2_html_attributes
    {
      class: h2_classes
    }
  end
end
