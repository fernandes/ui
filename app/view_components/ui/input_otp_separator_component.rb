# frozen_string_literal: true

# SeparatorComponent - ViewComponent implementation
#
# Visual divider between OTP input groups.
#
# @example
#   <%= render UI::SeparatorComponent.new %>
class UI::InputOtpSeparatorComponent < ViewComponent::Base
  include UI::InputOtpSeparatorBehavior

  # @param classes [String] Additional CSS classes
  # @param attributes [Hash] Additional HTML attributes
  def initialize(classes: "", **attributes)
    @classes = classes
    @attributes = attributes
  end

  def call
    attrs = input_otp_separator_html_attributes

    content_tag :div, **attrs.merge(@attributes) do
      # Render dot or dash separator
      content_tag :svg,
        nil,
        xmlns: "http://www.w3.org/2000/svg",
        width: "15",
        height: "15",
        viewBox: "0 0 15 15",
        fill: "none",
        class: "size-4 opacity-50" do
        tag.rect(x: "4", y: "7", width: "7", height: "1", fill: "currentColor", rx: "0.5")
      end
    end
  end
end
