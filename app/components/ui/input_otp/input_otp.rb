# frozen_string_literal: true

module UI
  module InputOtp
    # InputOtp - Phlex implementation
    #
    # Accessible one-time password container component.
    # Supports both composition (with Group/Slot/Separator) and auto-generation.
    #
    # @example With composition
    #   render UI::InputOtp::InputOtp.new(length: 6) do
    #     render UI::InputOtp::Group.new do
    #       render UI::InputOtp::Slot.new(index: 0)
    #     end
    #   end
    #
    # @example Auto-generated
    #   render UI::InputOtp::InputOtp.new(length: 6)
    class InputOtp < Phlex::HTML
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

      def view_template(&block)
        div(**input_otp_html_attributes.merge(@attributes)) do
          if block_given?
            yield
          else
            # Auto-generate inputs wrapped in Group
            render Group.new do
              @length.times do |i|
                render Slot.new(
                  index: i,
                  name: @name ? "#{@name}[#{i}]" : nil,
                  id: @id ? "#{@id}_#{i}" : nil,
                  disabled: @disabled
                )
              end
            end
          end
        end
      end
    end
  end
end
