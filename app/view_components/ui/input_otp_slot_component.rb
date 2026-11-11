# frozen_string_literal: true

# SlotComponent - ViewComponent implementation
#
# Draws one character of the OTP input's value (decorative, aria-hidden).
#
# @example
#   <%= render UI::InputOtpSlotComponent.new(index: 0) %>
class UI::InputOtpSlotComponent < ViewComponent::Base
  include UI::InputOtpSlotBehavior

  # @param index [Integer] Index of the slot in the OTP sequence
  # @param value [String] Pre-filled character (becomes part of the input's value)
  # @param name [String] Fallback name when the root has none (kept for compatibility; prefer `name:` on the InputOtpComponent)
  # @param id [String] Ignored (kept for compatibility; set `id:` on the InputOtpComponent)
  # @param disabled [Boolean] Disables the whole OTP input
  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(index: 0, value: "", name: nil, id: nil, disabled: false, classes: "", **attributes)
    @index = index
    @value = value
    @slot_name = name
    @disabled = disabled
    @classes = classes
    @attributes = attributes
  end

  def call
    content_tag :div, **input_otp_slot_html_attributes.deep_merge(@attributes) do
      safe_join([
        input_otp_slot_char.to_s,
        content_tag(:div, content_tag(:div, "", class: input_otp_caret_line_classes), class: input_otp_caret_classes)
      ])
    end
  end
end
