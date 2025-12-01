# frozen_string_literal: true

# Sheet overlay component (ViewComponent)
# Container and backdrop for sheet
#
# @example
#   <%= render UI::OverlayComponent.new do %>
#     <%= render UI::ContentComponent.new do %>
#       <!-- Content -->
#     <% end %>
#   <% end %>
class UI::SheetOverlayComponent < ViewComponent::Base
  include UI::SheetOverlayBehavior

  # @param open [Boolean] whether the sheet is open
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(open: false, classes: "", **attributes)
    @open = open
    @classes = classes
    @attributes = attributes
  end

  def call
    container_attrs = sheet_overlay_container_html_attributes
    container_attrs[:data] = container_attrs[:data].merge(@attributes.fetch(:data, {}))
    overlay_attrs = sheet_overlay_html_attributes

    content_tag :div, **container_attrs.merge(@attributes.except(:data)) do
      safe_join([
        content_tag(:div, "", **overlay_attrs),
        content
      ])
    end
  end
end
