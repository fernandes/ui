class FormPreview < Lookbook::Preview
  def default
    render UI::Form.new
  end
end
