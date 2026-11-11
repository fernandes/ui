# frozen_string_literal: true

# ToggleGroupComponent - ViewComponent implementation
#
# A container for a set of toggle items that can be toggled on or off.
# Supports single and multiple selection modes.
#
# @example Basic usage (single selection)
#   <%= render UI::ToggleGroupComponent.new(type: "single") do %>
#     <%= render UI::ItemComponent.new(value: "left") { "Left" } %>
#     <%= render UI::ItemComponent.new(value: "center") { "Center" } %>
#     <%= render UI::ItemComponent.new(value: "right") { "Right" } %>
#   <% end %>
#
# @example Multiple selection
#   <%= render UI::ToggleGroupComponent.new(
#     type: "multiple",
#     value: ["bold", "italic"]
#   ) do %>
#     <%= render UI::ItemComponent.new(value: "bold") { "Bold" } %>
#     <%= render UI::ItemComponent.new(value: "italic") { "Italic" } %>
#   <% end %>
class UI::ToggleGroupComponent < ViewComponent::Base
  include UI::ToggleGroupBehavior

  # @param type [String] Selection mode: "single" or "multiple"
  # @param variant [String] Visual style variant (default, outline)
  # @param size [String] Size variant (default, sm, lg)
  # @param value [String, Array] Current selected value(s)
  # @param spacing [Integer] Gap between items (0 means items touch)
  # @param orientation [String] Layout direction (horizontal, vertical); limits arrow keys to that axis
  # @param disabled [Boolean] Disable every item in the group
  # @param loop [Boolean] Whether arrow-key focus wraps around at the ends (default true)
  # @param classes [String] Additional CSS classes to merge
  # @param attributes [Hash] Additional HTML attributes
  def initialize(type: "single", variant: "default", size: "default", value: nil, spacing: 0, orientation: nil, disabled: false, loop: true, classes: "", **attributes)
    @type = type
    @variant = variant
    @size = size
    @value = value
    @spacing = spacing
    @orientation = orientation
    @disabled = disabled
    @loop = loop
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = toggle_group_html_attributes
    attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

    # Store context for child components
    set_toggle_group_context(toggle_group_context)

    content_tag :div, content, **attrs.merge(@attributes.except(:data))
  end

  private

  def set_toggle_group_context(context)
    @toggle_group_context = context
    # Make context available to children via helpers
    helpers.instance_variable_set(:@toggle_group_context, context) if helpers.respond_to?(:instance_variable_set)
  end
end
