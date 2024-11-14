class IconPreview < Lookbook::Preview
  def default
    render UI::Icon.new(:chart_area, class: "w-10 h-10")
  end
end
