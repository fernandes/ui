class LabelPreview < Lookbook::Preview
  def default
    render UI::Label.new
  end
end
