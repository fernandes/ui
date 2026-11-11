# frozen_string_literal: true

# Shared behavior for Slider Thumb component
# The thumb is the draggable handle that controls the slider value
module UI::SliderThumbBehavior
  # Build complete HTML attributes hash for slider thumb
  def slider_thumb_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    user_data = @attributes&.fetch(:data, {}) || {}

    # Merge pointer event action with user data
    thumb_data = {
      "ui--slider-target": "thumb",
      action: "pointerdown->ui--slider#startDrag"
    }.merge(user_data)

    # Caller attributes (e.g. an aria-label) win over the defaults.
    base_attrs = slider_thumb_aria_attributes.merge(base_attrs)

    base_attrs.merge(
      class: "border-primary ring-ring/50 absolute block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 #{@classes}".strip,
      "data-slot": "slider-thumb",
      role: "slider",
      tabindex: slider_thumb_disabled? ? -1 : 0,
      data: thumb_data
    )
  end

  # The context the enclosing slider shares while it renders (nil outside one).
  def slider_thumb_context
    Thread.current[:ui_slider_context]
  end

  def slider_thumb_disabled?
    (@disabled || slider_thumb_context&.dig(:disabled)) ? true : false
  end

  # Server-rendered ARIA, so the thumb is announced correctly before JS runs.
  # The controller keeps it in sync afterwards. Memoized: each thumb takes the
  # next index from the slider context exactly once.
  def slider_thumb_aria_attributes
    @slider_thumb_aria_attributes ||= begin
      context = slider_thumb_context
      if context
        index = context[:thumb_index]
        context[:thumb_index] += 1
        values = context[:values]
        {
          "aria-valuenow": values[index] || context[:min],
          "aria-valuemin": context[:min],
          "aria-valuemax": context[:max],
          "aria-orientation": context[:orientation],
          "aria-disabled": (slider_thumb_disabled? ? "true" : nil)
        }.merge(slider_thumb_name(context, index, values.length)).compact
      else
        {"aria-disabled": (@disabled ? "true" : nil)}.compact
      end
    end
  end

  # Radix defaults: "Minimum"/"Maximum" for two thumbs, "Value n of m" for
  # more. A single thumb takes the slider's own label (aria-labelledby or
  # aria-label passed to the slider).
  def slider_thumb_name(context, index, total)
    if total > 2
      {"aria-label": "Value #{index + 1} of #{total}"}
    elsif total == 2
      {"aria-label": %w[Minimum Maximum][index]}
    elsif context[:aria_labelledby]
      {"aria-labelledby": context[:aria_labelledby]}
    elsif context[:aria_label]
      {"aria-label": context[:aria_label]}
    else
      {}
    end
  end
end
