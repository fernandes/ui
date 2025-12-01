# frozen_string_literal: true

require "tailwind_merge"

# UI::ListBehavior
#
# @ui_component List
# @ui_category typography
#
# @ui_anatomy List - Container for list items (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::ListBehavior
  # Base CSS classes for List (ul)
  def list_base_classes
    "my-6 ml-6 list-disc [&>li]:mt-2"
  end

  # Merge base classes with custom classes using TailwindMerge
  def list_classes
    TailwindMerge::Merger.new.merge([list_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash
  def list_html_attributes
    {
      class: list_classes
    }
  end
end
