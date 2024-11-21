class LabelPreview < Lookbook::Preview
  def default
    render UI::Label.new { "Accept terms and conditions" }
  end
end
