# frozen_string_literal: true

require "tailwind_merge"

# UI::PBehavior
#
# @ui_component P
# @ui_category typography
#
# @ui_anatomy P - P component part (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::PBehavior
  # Base CSS classes for P
  def p_base_classes
    "leading-7 [&:not(:first-child)]:mt-6"
  end

  # Merge base classes with custom classes using TailwindMerge
  def p_classes
    TailwindMerge::Merger.new.merge([p_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash
  def p_html_attributes
    {
      class: p_classes
    }
  end
end
