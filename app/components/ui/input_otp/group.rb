# frozen_string_literal: true

module UI
  module InputOtp
    # Group - Phlex implementation
    #
    # Container for grouping OTP input slots together visually.
    #
    # @example
    #   render UI::InputOtp::Group.new do
    #     render UI::InputOtp::Slot.new(index: 0)
    #     render UI::InputOtp::Slot.new(index: 1)
    #   end
    class Group < Phlex::HTML
      include UI::InputOtp::InputOtpGroupBehavior

      # @param classes [String] Additional CSS classes
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**input_otp_group_html_attributes.merge(@attributes), &block)
      end
    end
  end
end
