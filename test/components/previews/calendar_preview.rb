class CalendarPreview < Lookbook::Preview
  def default
    render UI::Calendar.new
  end
end
