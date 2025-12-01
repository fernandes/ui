# frozen_string_literal: true

# Separator - Phlex implementation
#
# Visual divider between OTP input groups.
#
# @example
#   render UI::Separator.new
class UI::InputOtpSeparator < Phlex::HTML
  include UI::InputOtpSeparatorBehavior

  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def view_template
    div(**input_otp_separator_html_attributes.merge(@attributes)) do
      # Render dot or dash separator
      svg(
        xmlns: "http://www.w3.org/2000/svg",
        width: "15",
        height: "15",
        viewBox: "0 0 15 15",
        fill: "none",
        class: "size-4 opacity-50"
      ) do |s|
        s.rect(x: "4", y: "7", width: "7", height: "1", fill: "currentColor", rx: "0.5")
      end
    end
  end
end
