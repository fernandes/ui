# frozen_string_literal: true

# ViewportComponent - ViewComponent implementation
#
# Scrollable content container with hidden native scrollbar.
#
# @example Basic usage (automatically used by ScrollAreaComponent)
#   <%= render UI::ViewportComponent.new do %>
#     <!-- Content here -->
#   <% end %>
class UI::ScrollAreaViewportComponent < ViewComponent::Base
  include UI::ScrollAreaViewportBehavior

  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    viewport_attrs = scroll_area_viewport_html_attributes.deep_merge(@attributes)

    # Add Stimulus target
    viewport_attrs[:data] ||= {}
    viewport_attrs[:data][:"ui--scroll-area-target"] = "viewport"

    content_tag :div, **viewport_attrs do
      content_tag :div, content, style: "min-width: 100%; display: table;"
    end
  end
end
