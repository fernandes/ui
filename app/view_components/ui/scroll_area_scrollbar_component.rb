# frozen_string_literal: true

# ScrollbarComponent - ViewComponent implementation
#
# Custom scrollbar track that contains the draggable thumb.
#
# @example Vertical scrollbar (default)
#   <%= render UI::ScrollbarComponent.new(orientation: "vertical") %>
#
# @example Horizontal scrollbar
#   <%= render UI::ScrollbarComponent.new(orientation: "horizontal") %>
class UI::ScrollAreaScrollbarComponent < ViewComponent::Base
  include UI::ScrollAreaScrollbarBehavior

  # @param orientation [String] "vertical" or "horizontal"
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(orientation: "vertical", classes: "", **attributes)
    @orientation = orientation
    @classes = classes
    @attributes = attributes
  end

  def call
    scrollbar_attrs = scroll_area_scrollbar_html_attributes.deep_merge(@attributes)

    # Add Stimulus target
    scrollbar_attrs[:data] ||= {}
    scrollbar_attrs[:data][:"ui--scroll-area-target"] = "scrollbar"

    content_tag :div, **scrollbar_attrs do
      render UI::ThumbComponent.new
    end
  end
end
