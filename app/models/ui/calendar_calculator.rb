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
  def initialize(month:, year:, active_day: 0, jump_amount: 0, selected_value: nil)
    Date.beginning_of_week = :sunday
    @month = month
    @year = year
    @first_day = Date.new(year, month, 1)
    @last_day = @first_day.end_of_month
    @total_weeks = week_number(@last_day) - week_number(@first_day) + 1
    @days_in_month = @first_day.all_month

    @next_period = @first_day.advance(months: 1)
    @previous_period = @first_day.advance(months: -1)
    @active_day = active_day
    @jump_amount = jump_amount
    @selected_value = selected_value
    @selected_date = Date.parse(selected_value) if @selected_value.present?
  end

  def title
    @first_day.strftime("%B %Y")
  end

  def active_day
    return 0 if @active_day == 0

    if @jump_amount > 0
      (@previous_period.change(day: @active_day) + @jump_amount.days).day
    elsif @jump_amount < 0
      (@next_period.change(day: @active_day) + @jump_amount.days).day
    elsif @jump_amount == 0
      return @last_day.day if @active_day > @last_day.day
      @active_day
    end
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
      puts "#{date} - #{@selected_date.present?} - #{date == @selected_date}"
      role = if @selected_date.present? && date == @selected_date
        :selected
      elsif date == Date.today
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
