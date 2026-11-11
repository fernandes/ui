# frozen_string_literal: true

# InputOtpComponent - ViewComponent implementation
#
# Accessible one-time password field. Like shadcn's input-otp, it is one real
# <input> (autocomplete="one-time-code") laid over slots that draw its value.
# Supports both composition (with Group/Slot/Separator) and auto-generation.
#
# @example With composition
#   <%= render UI::InputOtpComponent.new(length: 6, id: "otp", name: "code") do %>
#     <%= render UI::InputOtpGroupComponent.new do %>
#       <%= render UI::InputOtpSlotComponent.new(index: 0) %>
#     <% end %>
#   <% end %>
#
# @example Auto-generated
#   <%= render UI::InputOtpComponent.new(length: 6, name: "code", "aria-label": "Verification code") %>
class UI::InputOtpComponent < ViewComponent::Base
  include UI::InputOtpBehavior

  INPUT_ARIA = %i[aria-label aria-labelledby aria-describedby aria-invalid aria-required].freeze

  # @param length [Integer] Maximum number of OTP characters
  # @param pattern [String] Regex for one valid character (default: digits only)
  # @param name [String] Form field name; the whole code is submitted under it
  # @param id [String] Id of the input (for `<label for>`)
  # @param value [String] Initial value
  # @param disabled [Boolean] Whether the input is disabled
  # @param autofocus [Boolean] Focus the input on page load (off by default)
  # @param required [Boolean] Whether the input is required
  # @param invalid [Boolean] Mark the input aria-invalid and the slots as errored
  # @param inputmode [String] Override the inputmode ("numeric" for digits, else "text")
  # @param input_attributes [Hash] Extra attributes for the input
  # @param classes [String] Additional CSS classes for the container
  # @param attributes [Hash] Additional HTML attributes for the container
  #   (aria-label / aria-labelledby / aria-describedby go to the input)
  def initialize(length: 6, pattern: "\\d", name: nil, id: nil, value: nil, disabled: false, autofocus: false, required: false, invalid: false, inputmode: nil, input_attributes: {}, classes: "", **attributes)
    @length = length
    @pattern = pattern
    @name = name
    @id = id
    @value = value
    @disabled = disabled
    @autofocus = autofocus
    @required = required
    @invalid = invalid
    @inputmode = inputmode
    @input_attributes = input_attributes.merge(attributes.slice(*INPUT_ARIA))
    @classes = classes
    @attributes = attributes.except(*INPUT_ARIA)
  end

  def call
    attrs = input_otp_html_attributes.deep_merge(@attributes)

    content_tag :div, **attrs do
      slots, context = with_input_otp_context { content.presence || auto_generated_slots }
      safe_join([slots, tag.input(**input_otp_input_attributes(context))])
    end
  end

  private

  def auto_generated_slots
    render(UI::InputOtpGroupComponent.new) do
      safe_join(@length.times.map { |i| render(UI::InputOtpSlotComponent.new(index: i)) })
    end
  end
end
