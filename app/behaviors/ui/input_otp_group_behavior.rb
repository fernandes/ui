# frozen_string_literal: true

require "tailwind_merge"

    # InputOtpGroupBehavior
    #
    # Shared behavior for InputOtpGroup component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation for grouping OTP slots.
    module UI::InputOtpGroupBehavior
      # Returns HTML attributes for the input OTP group element
      def input_otp_group_html_attributes
        {
          class: input_otp_group_classes
        }
      end

      # Returns combined CSS classes for the input OTP group
      def input_otp_group_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          input_otp_group_base_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      # Base classes applied to all input OTP groups
      def input_otp_group_base_classes
        "flex items-center"
      end
    end
