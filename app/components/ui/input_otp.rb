# frozen_string_literal: true

# InputOtp - Phlex implementation
#
# Accessible one-time password field. Like shadcn's input-otp, it is one real
# <input> (autocomplete="one-time-code") laid over slots that draw its value.
# Supports both composition (with Group/Slot/Separator) and auto-generation.
#
# @example With composition
#   label(for: "otp") { "Verification code" }
#   render UI::InputOtp.new(length: 6, id: "otp", name: "code") do
#     render UI::InputOtpGroup.new do
#       render UI::InputOtpSlot.new(index: 0)
#     end
#   end
#
# @example Auto-generated
#   render UI::InputOtp.new(length: 6, name: "code", "aria-label": "Verification code")
class UI::InputOtp < Phlex::HTML
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

  def view_template(&block)
    div(**input_otp_html_attributes.deep_merge(@attributes)) do
      _, context = with_input_otp_context do
        if block
          yield
        else
          # Auto-generate slots wrapped in a Group
          render UI::InputOtpGroup.new do
            @length.times { |i| render UI::InputOtpSlot.new(index: i) }
          end
        end
      end
      input(**input_otp_input_attributes(context))
    end
  end
end
