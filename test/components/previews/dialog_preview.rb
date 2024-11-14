class DialogPreview < Lookbook::Preview
  def default
    render UI::Dialog.new
  end
end
