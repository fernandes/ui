# frozen_string_literal: true

# SeparatorComponent - ViewComponent implementation
#
# Visually divides buttons within a button group.
# Extends UI::SeparatorComponent with button group specific styling.
#
# Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
#
# @example Basic separator
#   <%= render UI::ButtonGroupComponent.new do %>
#     <%= render UI::ButtonComponent.new(variant: :secondary) { "Copy" } %>
#     <%= render UI::SeparatorComponent.new %>
#     <%= render UI::ButtonComponent.new(variant: :secondary) { "Paste" } %>
#   <% end %>
class UI::ButtonGroupSeparatorComponent < ViewComponent::Base
  include UI::SeparatorBehavior
  include UI::SeparatorBehavior

  # @param orientation [Symbol, String] Direction of the separator (:horizontal, :vertical)
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(orientation: :vertical, decorative: true, classes: "", **attributes)
    @orientation = orientation
    @decorative = decorative
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.div(**separator_html_attributes.deep_merge(@attributes))
  end
end
