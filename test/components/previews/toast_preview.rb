class ToastPreview < Lookbook::Preview
  def default
    render UI::Toast.new
  end
end
