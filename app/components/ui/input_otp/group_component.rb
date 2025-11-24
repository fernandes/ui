# frozen_string_literal: true

module UI
  module InputOtp
    # GroupComponent - ViewComponent implementation
    #
    # Container for grouping OTP input slots together visually.
    #
    # @example
    #   <%= render UI::InputOtp::GroupComponent.new do %>
    #     <%= render UI::InputOtp::SlotComponent.new(index: 0) %>
    #     <%= render UI::InputOtp::SlotComponent.new(index: 1) %>
    #   <% end %>
    class GroupComponent < ViewComponent::Base
      include UI::InputOtp::InputOtpGroupBehavior

      # @param classes [String] Additional CSS classes
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = input_otp_group_html_attributes

        content_tag :div, **attrs.merge(@attributes) do
          content
        end
      end
    end
  end
end
