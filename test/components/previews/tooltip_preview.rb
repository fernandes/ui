class TooltipPreview < Lookbook::Preview
  def default
    render UI::Tooltip.new
  end
end
