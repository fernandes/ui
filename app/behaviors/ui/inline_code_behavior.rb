# frozen_string_literal: true

require "tailwind_merge"

# UI::InlineCodeBehavior
#
# @ui_component Inline Code
# @ui_category typography
#
# @ui_anatomy Inline Code - Inline Code component part (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::InlineCodeBehavior
  # Base CSS classes for InlineCode
  def inline_code_base_classes
    "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
  end

  # Merge base classes with custom classes using TailwindMerge
  def inline_code_classes
    TailwindMerge::Merger.new.merge([inline_code_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash
  def inline_code_html_attributes
    {
      class: inline_code_classes
    }
  end
end
