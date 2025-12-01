# frozen_string_literal: true

# SlotComponent - ViewComponent implementation
#
# Individual OTP input slot for a single character.
#
# @example
#   <%= render UI::SlotComponent.new(index: 0, value: "1") %>
class UI::InputOtpSlotComponent < ViewComponent::Base
  include UI::InputOtpSlotBehavior

  # @param index [Integer] Index of the slot in the OTP sequence
  # @param value [String] Character value to display in the slot
  # @param name [String] Form input name
  # @param id [String] HTML id attribute
  # @param disabled [Boolean] Whether input is disabled
  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(index: 0, value: "", name: nil, id: nil, disabled: false, classes: "", **attributes)
    @index = index
    @value = value
    @name = name
    @id = id
    @disabled = disabled
    @classes = classes
    @attributes = attributes
  end

  def call
    tag.input(**input_otp_slot_html_attributes.merge(@attributes))
  end
end
