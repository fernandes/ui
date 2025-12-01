# frozen_string_literal: true

# ResizablePanel component (ViewComponent)
# Individual resizable panel within a panel group
#
# @example Basic usage
#   <%= render UI::PanelComponent.new(default_size: 50) do %>
#     Panel content
#   <% end %>
#
# @example With constraints
#   <%= render UI::PanelComponent.new(default_size: 50, min_size: 20, max_size: 80) do %>
#     Constrained panel
#   <% end %>
class UI::ResizablePanelComponent < ViewComponent::Base
  include UI::ResizablePanelBehavior

  # @param default_size [Integer, Float] initial size as percentage (0-100)
  # @param min_size [Integer, Float, nil] minimum size as percentage
  # @param max_size [Integer, Float, nil] maximum size as percentage
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(default_size: nil, min_size: nil, max_size: nil, classes: "", attributes: {})
    @default_size = default_size
    @min_size = min_size
    @max_size = max_size
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = panel_html_attributes
    attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

    content_tag :div, **attrs.merge(@attributes.except(:data)) do
      content
    end
  end
end
