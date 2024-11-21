class CalendarPreview < Lookbook::Preview
  def default
    render UI::Calendar.new
  end

  def six_weeks
    render UI::Calendar.new(weeks: 6)
  end
end
