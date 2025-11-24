# frozen_string_literal: true

module UI
  module Slider
    # Shared behavior for Slider Thumb component
    # The thumb is the draggable handle that controls the slider value
    module SliderThumbBehavior
      # Build complete HTML attributes hash for slider thumb
      def slider_thumb_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        user_data = @attributes&.fetch(:data, {}) || {}

        # Merge pointer event action with user data
        thumb_data = {
          "ui--slider-target": "thumb",
          action: "pointerdown->ui--slider#startDrag"
        }.merge(user_data)

        base_attrs.merge(
          class: "border-primary ring-ring/50 absolute block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 #{@classes}".strip,
          "data-slot": "slider-thumb",
          role: "slider",
          tabindex: @disabled ? -1 : 0,
          data: thumb_data
        )
      end
    end
  end
end
