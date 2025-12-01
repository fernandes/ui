# frozen_string_literal: true

# Shared behavior for Slider Range component
# The range is the filled portion of the track showing the selected value
module UI::SliderRangeBehavior
  # Build complete HTML attributes hash for slider range
  def slider_range_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    user_data = @attributes&.fetch(:data, {}) || {}

    base_attrs.merge(
      class: "bg-primary absolute rounded-full data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full #{@classes}".strip,
      "data-slot": "slider-range",
      "data-ui--slider-target": "range",
      data: user_data
    )
  end
end
