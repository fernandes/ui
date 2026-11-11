# frozen_string_literal: true

require "tailwind_merge"

# InputOtpSeparatorBehavior
#
# Shared behavior for InputOtpSeparator component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation for OTP slot separators.
# Decorative: the OTP's single input carries the semantics, so it's aria-hidden.
module UI::InputOtpSeparatorBehavior
  # Returns HTML attributes for the input OTP separator element
  def input_otp_separator_html_attributes
    {
      class: input_otp_separator_classes,
      role: "separator",
      "aria-hidden": "true",
      data: {slot: "input-otp-separator"}
    }
  end

  # Returns combined CSS classes for the input OTP separator
  def input_otp_separator_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    UI::ClassMerger.merge([
      input_otp_separator_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes applied to all input OTP separators
  def input_otp_separator_base_classes
    "flex items-center justify-center"
  end
end
