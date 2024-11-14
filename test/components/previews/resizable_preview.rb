class ResizablePreview < Lookbook::Preview
  def default
    render UI::Resizable.new
  end
end
