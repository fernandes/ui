class InputOTPPreview < Lookbook::Preview
  def default
    render UI::InputOTP.new
  end
end
