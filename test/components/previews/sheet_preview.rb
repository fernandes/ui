class SheetPreview < Lookbook::Preview
  def default
    render UI::Sheet.new
  end
end
