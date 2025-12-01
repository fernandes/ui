# frozen_string_literal: true

require "tailwind_merge"

# UI::LeadBehavior
#
# @ui_component Lead
# @ui_category typography
#
# @ui_anatomy Lead - Lead component part (required)
#
# @ui_feature Custom styling with Tailwind classes
#
module UI::LeadBehavior
  # Base CSS classes for Lead
  def lead_base_classes
    "text-xl text-muted-foreground"
  end

  # Merge base classes with custom classes using TailwindMerge
  def lead_classes
    TailwindMerge::Merger.new.merge([lead_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash
  def lead_html_attributes
    {
      class: lead_classes
    }
  end
end
