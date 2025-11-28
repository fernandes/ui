# frozen_string_literal: true

    # Shared behavior for Slider Track component
    # The track is the background rail that contains the range
    module UI::SliderTrackBehavior
      # Build complete HTML attributes hash for slider track
      def slider_track_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        user_data = @attributes&.fetch(:data, {}) || {}

        # Merge click action with user data
        track_data = {
          "ui--slider-target": "track",
          action: "click->ui--slider#clickTrack"
        }.merge(user_data)

        base_attrs.merge(
          class: "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 #{@classes}".strip,
          "data-slot": "slider-track",
          data: track_data
        )
      end
    end
