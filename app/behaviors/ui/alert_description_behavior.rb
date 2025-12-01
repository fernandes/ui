# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Alert Description component
# Handles description text styling
module UI::AlertDescriptionBehavior
  # Base CSS classes for alert description
  def alert_description_base_classes
    "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed"
  end

  # Merge base classes with custom classes
  def alert_description_classes
    TailwindMerge::Merger.new.merge([alert_description_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash for alert description
  def alert_description_html_attributes
    base_attrs = @attributes || {}
    base_attrs.merge(
      class: alert_description_classes,
      "data-slot": "alert-description"
    )
  end

  # Renders the alert description HTML (for ERB partials)
  def render_alert_description(&content_block)
    all_attributes = alert_description_html_attributes.deep_merge(@attributes || {})
    content_tag(:div, **all_attributes, &content_block)
  end
end
