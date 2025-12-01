# frozen_string_literal: true

# UI::ProgressBehavior
#
# @ui_component Progress
# @ui_description Progress - Phlex implementation
# @ui_category feedback
#
# @ui_anatomy Progress - A progress indicator component for displaying task completion or loading status. (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Form integration
# @ui_feature ARIA attributes for accessibility
#
# @ui_aria_pattern Meter
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/meter/
# @ui_aria_attr aria-valuemin
# @ui_aria_attr aria-valuemax
# @ui_aria_attr aria-valuenow
# @ui_aria_attr role="progressbar"
#
# @ui_related skeleton
#
module UI::ProgressBehavior
  # Returns HTML attributes for the progress container element
  def progress_html_attributes
    {
      class: progress_classes,
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": progress_value.to_i,
      data: {slot: "progress"}
    }
  end

  # Returns combined CSS classes for the progress container
  def progress_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      progress_base_classes,
      classes_value
    ].compact.join(" "))
  end

  # Returns the validated progress value (between 0 and 100)
  def progress_value
    (@value || 0).to_f.clamp(0, 100)
  end

  # Returns the indicator classes
  def progress_indicator_classes
    "bg-primary h-full w-full flex-1 transition-all"
  end

  # Returns the transform style for the indicator
  def progress_indicator_style
    "transform: translateX(-#{100 - progress_value}%)"
  end

  private

  # Base classes applied to all progress containers
  def progress_base_classes
    "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full"
  end
end
