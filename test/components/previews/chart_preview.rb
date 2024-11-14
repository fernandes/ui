class ChartPreview < Lookbook::Preview
  def default
    render UI::Chart.new
  end
end
