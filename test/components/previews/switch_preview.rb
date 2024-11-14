class SwitchPreview < Lookbook::Preview
  def default
    render UI::Switch.new
  end

  def checked
    render UI::Switch.new(checked: true)
  end
end
