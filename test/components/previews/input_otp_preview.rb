class InputOtpPreview < Lookbook::Preview
  def default
    render UI::InputOtp.new
  end
end
