class InputPreview < Lookbook::Preview
  def default
    render UI::Input.new(placeholder: "Insert Title Here")
  end
end
