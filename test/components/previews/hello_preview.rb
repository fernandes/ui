class HelloPreview < Lookbook::Preview
  def default
    render UI::Hello.new
  end
end
