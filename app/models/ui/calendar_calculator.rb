class UI::CalendarCalculator
  WEEK_NUMBER_FORMAT = "%W"
  WEEKDAY_MAP = {
    0 => :su,
    1 => :mo,
    2 => :tu,
    3 => :we,
    4 => :th,
    5 => :fr,
    6 => :sa,
  }

  attr_reader :month, :year, :total_weeks, :next_period, :previous_period
  def initialize(month:, year:)
    Date.beginning_of_week = :sunday
    @month = month
    @year = year
    @first_day = Date.new(year, month, 1)
    @last_day = @first_day.end_of_month
    @total_weeks = week_number(@last_day) - week_number(@first_day) + 1
    @days_in_month = @first_day.all_month

    @next_period = @first_day.advance(months: 1)
    @previous_period = @first_day.advance(months: -1)
  end

  def title
    @first_day.strftime("%B %Y")
  end

  def first_week
    calculate_week(@first_day)
  end

  def last_week
    calculate_week(@last_day)
  end

  def weeks(n = nil, &block)
    base_day = @first_day
    1.upto(n || @total_weeks) do |n|
      week = calculate_week(base_day)
      yield week
      base_day = base_day.next_week
    end
  end

  private

  def calculate_week(base_date)
    base_date.all_week.map do |date|
      role = if date == Date.today
        :today
      elsif @days_in_month.include?(date)
        :inside
      else
        :outside
      end
      [
        WEEKDAY_MAP[date.wday],
        {day: date.day, role: role}
      ]
    end.to_h
  end

  def week_number(date)
    date.strftime(WEEK_NUMBER_FORMAT).to_i
  end
end
