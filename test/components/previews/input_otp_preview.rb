class InputOtpPreview < Lookbook::Preview
  def default
    render UI::InputOtp.new do |input|
      input.group do
        input.slot(value: 2)
        input.slot(input: true)
        input.slot
      end
      input.separator
      input.group do
        input.slot
        input.slot
        input.slot
      end
    end
  end
end
