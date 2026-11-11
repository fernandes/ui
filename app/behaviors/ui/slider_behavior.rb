# frozen_string_literal: true

# Shared behavior for Slider Root component
# Handles Stimulus controller setup and data attributes for range slider
module UI::SliderBehavior
  # Generate Stimulus controller data attributes
  def slider_data_attributes
    attrs = {
      controller: "ui--slider",
      ui__slider_min_value: @min || 0,
      ui__slider_max_value: @max || 100,
      ui__slider_step_value: @step || 1,
      ui__slider_value_value: slider_values.to_json,
      ui__slider_disabled_value: @disabled || false,
      ui__slider_orientation_value: @orientation || "horizontal",
      ui__slider_inverted_value: @inverted || false,
      ui__slider_name_value: @name || ""
    }

    # Add center_point if defined (for bidirectional sliders like balance/pan)
    if @center_point
      attrs[:ui__slider_center_point_value] = @center_point
    end

    attrs
  end

  # Values the slider starts with (always an Array).
  def slider_values
    Array(@value || @default_value || [@min || 0])
  end

  # Shared with the thumbs while the slider renders, so each thumb can render
  # its own aria-valuenow/min/max, orientation, disabled state and name.
  def slider_context
    root_attributes = @attributes || {}
    aria = root_attributes[:aria].is_a?(Hash) ? root_attributes[:aria] : {}
    {
      min: @min || 0,
      max: @max || 100,
      values: slider_values,
      orientation: @orientation || "horizontal",
      disabled: @disabled ? true : false,
      aria_label: root_attributes[:"aria-label"] || root_attributes["aria-label"] || aria[:label],
      aria_labelledby: root_attributes[:"aria-labelledby"] || root_attributes["aria-labelledby"] || aria[:labelledby],
      thumb_index: 0
    }
  end

  # Runs the block (the slider's children) with the context available to the
  # thumbs. Restores any outer slider's context afterwards.
  def with_slider_context
    previous = Thread.current[:ui_slider_context]
    Thread.current[:ui_slider_context] = slider_context
    begin
      yield
    ensure
      Thread.current[:ui_slider_context] = previous
    end
  end

  # One hidden input per value so the slider submits with its form.
  # A range submits as `name[]` (Rails array param), a single value as `name`.
  def slider_hidden_inputs
    return [] if @name.blank?

    values = slider_values
    input_name = (values.length > 1) ? "#{@name}[]" : @name
    values.map do |value|
      {
        type: "hidden",
        name: input_name,
        value: value,
        disabled: @disabled ? true : nil,
        data: {"ui--slider-target": "input"}
      }.compact
    end
  end

  # Merge user-provided data attributes with slider controller data
  def merged_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(slider_data_attributes)
  end

  # Build complete HTML attributes hash for slider root
  def slider_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col #{@classes}".strip,
      "data-orientation": @orientation || "horizontal",
      "data-disabled": @disabled ? "" : nil,
      "data-slot": "slider",
      role: "group",
      data: merged_data_attributes
    ).compact
  end
end
