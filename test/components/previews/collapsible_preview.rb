class CollapsiblePreview < Lookbook::Preview
  def default
    render UI::Collapsible.new
  end
end
