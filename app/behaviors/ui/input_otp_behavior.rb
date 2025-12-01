# frozen_string_literal: true

require "tailwind_merge"

# UI::InputOtpBehavior
#
# @ui_component Input OTP
# @ui_description InputOtp - Phlex implementation
# @ui_category forms
#
# @ui_anatomy Input OTP - Accessible one-time password container component. (required)
# @ui_anatomy Group - Container for grouping OTP input slots together visually.
# @ui_anatomy Separator - Visual divider between OTP input groups.
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Disabled state support
#
# @ui_keyboard ArrowLeft Moves focus left or decreases value
# @ui_keyboard ArrowRight Moves focus right or increases value
# @ui_keyboard Home Moves focus to first item
# @ui_keyboard End Moves focus to last item
#
module UI::InputOtpBehavior
  # Returns HTML attributes for the input OTP container element
  def input_otp_html_attributes
    attrs = {
      class: input_otp_classes,
      data: input_otp_data_attributes
    }
    attrs[:id] = @id if @id
    attrs
  end

  # Returns combined CSS classes for the input OTP container
  def input_otp_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      input_otp_base_classes,
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for Stimulus controller
  def input_otp_data_attributes
    {
      controller: "ui--input-otp",
      ui__input_otp_length_value: @length,
      ui__input_otp_pattern_value: @pattern
    }.compact
  end

  private

  # Base classes applied to all input OTP containers
  def input_otp_base_classes
    "flex items-center gap-2 has-[:disabled]:opacity-50"
  end
end
