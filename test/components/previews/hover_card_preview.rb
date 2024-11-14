class HoverCardPreview < Lookbook::Preview
  def default
    render UI::HoverCard.new
  end
end
