# frozen_string_literal: true

require "tailwind_merge"

# UI::AlertBehavior
#
# @ui_component Alert
# @ui_description Alert - Phlex implementation
# @ui_category feedback
#
# @ui_anatomy Alert - A callout component for displaying important information to users. (required)
# @ui_anatomy Description - Description text for an alert component.
# @ui_anatomy Title - Title text for an alert component.
#
# @ui_feature Custom styling with Tailwind classes
#
# @ui_aria_pattern Alert
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/alert/
# @ui_aria_attr role="alert"
#
# @ui_related alert_dialog
# @ui_related toast
#
module UI::AlertBehavior
  # Base CSS classes for alert container
  # Uses grid layout that adapts when SVG icons are present
  def alert_base_classes
    "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current"
  end

  # Variant-specific classes
  def alert_variant_classes
    case @variant
    when :destructive
      "border-destructive text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
    else # :default
      "bg-card text-card-foreground"
    end
  end

  # Merge base classes with variant and custom classes
  def alert_classes
    TailwindMerge::Merger.new.merge([alert_base_classes, alert_variant_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash for alert container
  def alert_html_attributes
    base_attrs = @attributes || {}
    base_attrs.merge(
      class: alert_classes,
      role: "alert",
      "data-slot": "alert"
    )
  end

  # Renders the alert HTML (for ERB partials)
  def render_alert(&content_block)
    all_attributes = alert_html_attributes.deep_merge(@attributes || {})
    content_tag(:div, **all_attributes, &content_block)
  end
end
