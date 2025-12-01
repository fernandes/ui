# frozen_string_literal: true

# ProgressComponent - ViewComponent implementation
#
# A progress indicator component for displaying task completion or loading status.
# Uses ProgressBehavior for shared styling logic.
#
# @example Basic usage with value
#   <%= render UI::ProgressComponent.new(value: 60) %>
#
# @example Indeterminate progress (no value)
#   <%= render UI::ProgressComponent.new %>
#
# @example With custom classes
#   <%= render UI::ProgressComponent.new(value: 80, classes: "h-4") %>
class UI::ProgressComponent < ViewComponent::Base
  include UI::ProgressBehavior

  # @param value [Numeric] Progress value between 0 and 100 (default: 0)
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(value: 0, classes: "", **attributes)
    @value = value
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = progress_html_attributes

    content_tag :div, **attrs.merge(@attributes) do
      content_tag :div,
        nil,
        class: progress_indicator_classes,
        style: progress_indicator_style,
        data: {slot: "progress-indicator"}
    end
  end
end
