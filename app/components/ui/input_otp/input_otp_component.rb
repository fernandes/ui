# frozen_string_literal: true

module UI
  module InputOtp
    # InputOtpComponent - ViewComponent implementation
    #
    # Accessible one-time password container component.
    # Supports both composition (with Group/Slot/Separator) and auto-generation.
    #
    # @example With composition
    #   <%= render UI::InputOtp::InputOtpComponent.new(length: 6) do %>
    #     <%= render UI::InputOtp::GroupComponent.new do %>
    #       <%= render UI::InputOtp::SlotComponent.new(index: 0) %>
    #     <% end %>
    #   <% end %>
    #
    # @example Auto-generated
    #   <%= render UI::InputOtp::InputOtpComponent.new(length: 6) %>
    class InputOtpComponent < ViewComponent::Base
      include UI::InputOtp::InputOtpBehavior

      # @param length [Integer] Maximum number of OTP characters
      # @param pattern [String] Regex pattern for valid characters (default: digits only)
      # @param name [String] Form input name
      # @param id [String] HTML id attribute
      # @param disabled [Boolean] Whether inputs are disabled
      # @param classes [String] Additional CSS classes
      # @param attributes [Hash] Additional HTML attributes
      def initialize(length: 6, pattern: "\\d", name: nil, id: nil, disabled: false, classes: "", **attributes)
        @length = length
        @pattern = pattern
        @name = name
        @id = id
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = input_otp_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)) do
          if content.present?
            content
          else
            # Auto-generate inputs wrapped in GroupComponent
            render(GroupComponent.new) do
              safe_join(
                @length.times.map do |i|
                  render(SlotComponent.new(
                    index: i,
                    name: @name ? "#{@name}[#{i}]" : nil,
                    id: @id ? "#{@id}_#{i}" : nil,
                    disabled: @disabled
                  ))
                end
              )
            end
          end
        end
      end
    end
  end
end
