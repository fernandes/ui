# frozen_string_literal: true

require "tailwind_merge"

module UI
  module InputOtp
    # InputOtpSlotBehavior
    #
    # Shared behavior for InputOtpSlot component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent HTML attribute generation and styling for individual OTP input slots.
    module InputOtpSlotBehavior
      # Returns HTML attributes for the input OTP slot element
      def input_otp_slot_html_attributes
        {
          type: "text",
          maxlength: 1,
          inputmode: "numeric",
          autocomplete: "one-time-code",
          value: @value,
          name: @name,
          id: @id,
          disabled: @disabled,
          class: input_otp_slot_classes,
          data: input_otp_slot_data_attributes
        }.compact
      end

      # Returns combined CSS classes for the input OTP slot
      def input_otp_slot_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          input_otp_slot_base_classes,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for Stimulus integration
      def input_otp_slot_data_attributes
        {
          "ui__input_otp_target": "input",
          action: "input->ui--input-otp#input keydown->ui--input-otp#keydown paste->ui--input-otp#paste"
        }
      end

      private

      # Base classes applied to all input OTP slots (from shadcn/ui)
      def input_otp_slot_base_classes
        "border-input relative flex size-9 items-center justify-center border-y border-r text-sm text-center shadow-xs transition-all first:rounded-l-md first:border-l last:rounded-r-md focus:z-10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      end
    end
  end
end
