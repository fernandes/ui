# frozen_string_literal: true

module UI
  module Progress
    # Progress - Phlex implementation
    #
    # A progress indicator component for displaying task completion or loading status.
    # Uses ProgressBehavior for shared styling logic.
    #
    # @example Basic usage with value
    #   render UI::Progress::Progress.new(value: 60)
    #
    # @example Indeterminate progress (no value)
    #   render UI::Progress::Progress.new
    #
    # @example With custom classes
    #   render UI::Progress::Progress.new(value: 80, classes: "h-4")
    class Progress < Phlex::HTML
      include UI::Progress::ProgressBehavior

      # @param value [Numeric] Progress value between 0 and 100 (default: 0)
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(value: 0, classes: "", **attributes)
        @value = value
        @classes = classes
        @attributes = attributes
      end

      def view_template
        div(**progress_html_attributes.deep_merge(@attributes)) do
          div(
            class: progress_indicator_classes,
            style: progress_indicator_style,
            data: { slot: "progress-indicator" }
          )
        end
      end
    end
  end
end
