# frozen_string_literal: true

# Dialog overlay component (ViewComponent)
# Container and backdrop for dialog
#
# @example
#   <%= render UI::OverlayComponent.new do %>
#     <%= render UI::ContentComponent.new do %>
#       <!-- Content -->
#     <% end %>
#   <% end %>
class UI::DialogOverlayComponent < ViewComponent::Base
  include UI::DialogOverlayBehavior

  # @param open [Boolean] whether the dialog is open
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(open: false, classes: "", **attributes)
    @open = open
    @classes = classes
    @attributes = attributes
  end

  def call
    container_attrs = dialog_overlay_container_html_attributes
    container_attrs[:data] = container_attrs[:data].merge(@attributes.fetch(:data, {}))
    overlay_attrs = dialog_overlay_html_attributes

    content_tag :div, **container_attrs.merge(@attributes.except(:data)) do
      safe_join([
        content_tag(:div, "", **overlay_attrs),
        content
      ])
    end
  end
end
