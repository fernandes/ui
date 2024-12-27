class CalendarPreview < Lookbook::Preview
  def default
    render UI::Calendar.new(month: month, year: year)
  end

  def six_weeks
    render UI::Calendar.new(month: month, year: year, weeks: 6)
  end

  private

  def month
    Date.today.month
  end

  def year
    Date.today.year
  end
end
