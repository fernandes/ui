# frozen_string_literal: true

# TabsTrigger component (ViewComponent)
# Button that activates associated content panel
#
# @example Basic usage
#   <%= render UI::TabsTriggerComponent.new(value: "account") { "Account" } %>
#
# @example Disabled trigger
#   <%= render UI::TabsTriggerComponent.new(value: "disabled", disabled: true) { "Disabled" } %>
class UI::TabsTriggerComponent < ViewComponent::Base
  include UI::TabsTriggerBehavior

  # @param value [String] unique identifier for this trigger
  # @param default_value [String] currently active tab value
  # @param orientation [String] "horizontal" or "vertical"
  # @param disabled [Boolean] whether trigger is disabled
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(value: "", default_value: "", orientation: "horizontal", disabled: false, classes: "", attributes: {})
    @value = value
    @default_value = default_value
    @orientation = orientation
    @disabled = disabled
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = trigger_html_attributes
    attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

    content_tag :button, **attrs.merge(@attributes.except(:data)) do
      content
    end
  end
end
