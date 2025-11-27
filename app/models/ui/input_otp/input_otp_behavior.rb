# frozen_string_literal: true

require "tailwind_merge"

module UI
  module InputOtp
    # InputOtpBehavior
    #
    # Shared behavior for InputOtp component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation and styling for OTP input containers.
    module InputOtpBehavior
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
          "ui__input_otp_length_value": @length,
          "ui__input_otp_pattern_value": @pattern
        }.compact
      end

      private

      # Base classes applied to all input OTP containers
      def input_otp_base_classes
        "flex items-center gap-2 has-[:disabled]:opacity-50"
      end
    end
  end
end
