# frozen_string_literal: true

# UI::SeparatorBehavior
#
# @ui_component Separator
# @ui_description Separator - Phlex implementation
# @ui_category layout
#
# @ui_anatomy Separator - Visually or semantically separates content. (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature ARIA attributes for accessibility
#
module UI::SeparatorBehavior
  # Returns HTML attributes for the separator element
  def separator_html_attributes
    attrs = {
      class: separator_classes,
      data: {
        slot: "separator",
        orientation: @orientation
      }
    }

    # Only add ARIA attributes when separator is not decorative
    unless @decorative
      attrs[:role] = "separator"
      attrs[:"aria-orientation"] = @orientation.to_s
    end

    attrs
  end

  # Returns combined CSS classes for the separator
  def separator_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      separator_base_classes,
      separator_orientation_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes applied to all separators
  # Matches shadcn/ui v4 exactly
  def separator_base_classes
    "shrink-0 bg-border"
  end

  # Orientation-specific classes based on @orientation
  # Matches shadcn/ui v4 exactly
  def separator_orientation_classes
    case @orientation.to_s
    when "vertical"
      "h-full w-px"
    else # horizontal (default)
      "h-px w-full"
    end
  end
end
