# frozen_string_literal: true

# Switch - Phlex implementation
#
# A toggle control that allows the user to switch between checked and unchecked states.
# Based on Radix UI Switch primitive.
#
# @example Basic usage
#   render UI::Switch.new(checked: false, id: "airplane-mode")
#
# @example With label
#   div(class: "flex items-center space-x-2") do
#     render UI::Switch.new(id: "airplane-mode")
#     label(for: "airplane-mode") { "Airplane Mode" }
#   end
#
# @example With form
#   render UI::Switch.new(
#     checked: true,
#     name: "notifications",
#     id: "notifications"
#   )
class UI::Switch < Phlex::HTML
  include UI::SwitchBehavior

  # @param checked [Boolean] Whether the switch is checked
  # @param disabled [Boolean] Whether the switch is disabled
  # @param classes [String] Additional CSS classes
  # @param name [String] Name for form submission (creates hidden input)
  # @param id [String] ID attribute
  # @param value [String] Value for form submission when checked
  # @param required [Boolean] Whether the switch is required (aria-required)
  # @param attributes [Hash] Additional HTML attributes
  def initialize(checked: false, disabled: false, classes: "", name: nil, id: nil, value: "1", required: false, **attributes)
    @checked = checked
    @required = required
    @disabled = disabled
    @classes = classes
    @name = name
    @id = id
    @value = value
    @attributes = attributes
  end

  def view_template(&block)
    attrs = switch_html_attributes.deep_merge(@attributes)
    attrs[:id] = @id if @id.present?

    button(**attrs) do
      render_thumb
      render_hidden_input if @name.present?
    end
  end

  private

  def render_thumb
    span(
      data: {ui__switch_target: "thumb", slot: "switch-thumb", state: switch_state},
      class: switch_thumb_classes
    )
  end

  def render_hidden_input
    input(**switch_hidden_input_attributes)
  end
end
