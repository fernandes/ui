# frozen_string_literal: true

# Calendar component (Phlex)
# A date picker calendar with support for single, range, and multiple selection
#
# @example Basic usage (single date)
#   render UI::Calendar.new(selected: Date.today)
#
# @example Range selection
#   render UI::Calendar.new(mode: :range, selected: Date.today..Date.today + 7)
#
# @example Multiple months
#   render UI::Calendar.new(number_of_months: 2)
#
# @example With dropdowns
#   render UI::Calendar.new(show_dropdowns: true)
class UI::Calendar < Phlex::HTML
  include UI::CalendarBehavior

  # @param mode [Symbol] :single, :range, or :multiple selection mode
  # @param selected [Date, Range, Array] initially selected date(s)
  # @param month [Date] initially displayed month
  # @param number_of_months [Integer] number of months to display side by side
  # @param week_starts_on [Integer] 0 for Sunday, 1 for Monday, etc.
  # @param locale [String] BCP 47 locale tag for formatting (default: "en-US")
  # @param min_date [Date] minimum selectable date
  # @param max_date [Date] maximum selectable date
  # @param disabled_dates [Array<Date>] dates that cannot be selected
  # @param show_outside_days [Boolean] show days from adjacent months
  # @param fixed_weeks [Boolean] always show 6 weeks
  # @param show_dropdowns [Boolean] show month/year dropdowns
  # @param year_range [Integer] number of years to show in dropdown
  # @param min_range_days [Integer] minimum days for range selection (0 = no min)
  # @param max_range_days [Integer] maximum days for range selection (0 = no max)
  # @param exclude_disabled [Boolean] prevent ranges that contain disabled dates
  # @param use_native_select [Boolean] use native HTML select for dropdowns (default: true)
  # @param name [String] form field name for hidden input
  # @param classes [String] additional CSS classes
  # @param attributes [Hash] additional HTML attributes
  def initialize(
    mode: :single,
    selected: nil,
    month: Date.today,
    number_of_months: 1,
    week_starts_on: 0,
    locale: "en-US",
    min_date: nil,
    max_date: nil,
    disabled_dates: [],
    show_outside_days: true,
    fixed_weeks: false,
    show_dropdowns: false,
    year_range: 100,
    min_range_days: 0,
    max_range_days: 0,
    exclude_disabled: false,
    use_native_select: true,
    name: nil,
    classes: "",
    **attributes
  )
    @mode = mode
    @selected = selected
    @month = month
    @number_of_months = number_of_months
    @week_starts_on = week_starts_on
    @locale = locale
    @min_date = min_date
    @max_date = max_date
    @disabled_dates = disabled_dates
    @show_outside_days = show_outside_days
    @fixed_weeks = fixed_weeks
    @show_dropdowns = show_dropdowns
    @year_range = year_range
    @min_range_days = min_range_days
    @max_range_days = max_range_days
    @exclude_disabled = exclude_disabled
    @use_native_select = use_native_select
    @name = name
    @classes = classes
    @attributes = attributes
    super()
  end

  def view_template
    div(**calendar_html_attributes) do
      # Screen reader live region for announcements
      div(class: "sr-only", aria_live: "polite", aria_atomic: "true", data: {ui__calendar_target: "liveRegion"})

      # Hidden input for form submission
      if @name
        input(type: "hidden", name: @name, value: selected_value, data: {ui__calendar_target: "input"})
      end

      @number_of_months.times do |i|
        render_month(i)
      end
    end
  end

  private

  def render_month(index)
    div(class: "space-y-4") do
      render_header(index)
      render_table
    end
  end

  def render_header(index)
    div(class: "flex justify-center pt-1 relative items-center") do
      # Previous button (only on first month or always)
      button(
        type: "button",
        data: {action: "click->ui--calendar#previousMonth"},
        class: nav_button_classes("left"),
        aria: {label: "Go to previous month"}
      ) do
        render_chevron_left
      end

      if @show_dropdowns
        render_dropdowns
      else
        div(class: "text-sm font-medium", data: {ui__calendar_target: "monthLabel"})
      end

      # Next button
      button(
        type: "button",
        data: {action: "click->ui--calendar#nextMonth"},
        class: nav_button_classes("right"),
        aria: {label: "Go to next month"}
      ) do
        render_chevron_right
      end
    end
  end

  def render_dropdowns
    if use_native_select?
      render_native_dropdowns
    else
      render_ui_select_dropdowns
    end
  end

  def render_native_dropdowns
    div(class: "flex items-center gap-1") do
      select(
        data: {ui__calendar_target: "monthSelect", action: "change->ui--calendar#goToMonth"},
        class: "text-sm font-medium h-7 px-2 rounded-md border border-input bg-background"
      ) do
        Date::MONTHNAMES.compact.each_with_index do |name, i|
          option(value: i) { name }
        end
      end

      select(
        data: {ui__calendar_target: "yearSelect", action: "change->ui--calendar#goToYear"},
        class: "text-sm font-medium h-7 px-2 rounded-md border border-input bg-background"
      ) do
        current_year = Date.today.year
        ((current_year - @year_range)..(current_year + 10)).each do |y|
          option(value: y) { y.to_s }
        end
      end
    end
  end

  def render_ui_select_dropdowns
    div(class: "flex items-center gap-1 px-8 flex-1") do
      # Month select
      render UI::Select.new(classes: "flex-1", value: (@month.month - 1).to_s) do
        render UI::SelectTrigger.new(classes: "h-9 w-full gap-1 px-2 text-sm font-medium border-0 shadow-none")
        render UI::SelectContent.new(classes: "min-w-[8rem]") do
          Date::MONTHNAMES.compact.each_with_index do |name, i|
            render UI::SelectItem.new(value: i.to_s) { name }
          end
        end
        input(
          type: "hidden",
          value: (@month.month - 1).to_s,
          data: {
            ui__select_target: "hiddenInput",
            ui__calendar_target: "monthSelect",
            action: "change->ui--calendar#goToMonth"
          }
        )
      end

      # Year select
      render UI::Select.new(value: @month.year.to_s) do
        render UI::SelectTrigger.new(classes: "min-w-[75px] h-9 w-auto gap-1 px-2 text-sm font-medium border-0 shadow-none")
        render UI::SelectContent.new(classes: "min-w-[5rem] max-h-[200px]") do
          current_year = Date.today.year
          ((current_year - @year_range)..(current_year + 10)).each do |y|
            render UI::SelectItem.new(value: y.to_s) { y.to_s }
          end
        end
        input(
          type: "hidden",
          value: @month.year.to_s,
          data: {
            ui__select_target: "hiddenInput",
            ui__calendar_target: "yearSelect",
            action: "change->ui--calendar#goToYear"
          }
        )
      end
    end
  end

  def render_table
    table(class: "w-full border-collapse space-y-1", role: "grid") do
      thead { render_weekdays }
      tbody(data: {ui__calendar_target: "grid"}, role: "rowgroup")
    end
  end

  def render_weekdays
    tr(class: "flex", data: {ui__calendar_target: "weekdaysHeader"}) do
      ordered_weekdays.each do |day|
        th(scope: "col", class: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]") { day }
      end
    end
  end

  def nav_button_classes(position)
    base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium " \
           "ring-offset-background transition-colors " \
           "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " \
           "border border-input bg-background hover:bg-accent hover:text-accent-foreground " \
           "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
    position_class = (position == "left") ? "absolute left-1" : "absolute right-1"
    "#{base} #{position_class}"
  end

  def render_chevron_left
    svg(
      xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
      viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
      stroke_width: "2", stroke_linecap: "round", stroke_linejoin: "round",
      class: "h-4 w-4"
    ) do |s|
      s.path(d: "m15 18-6-6 6-6")
    end
  end

  def render_chevron_right
    svg(
      xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
      viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
      stroke_width: "2", stroke_linecap: "round", stroke_linejoin: "round",
      class: "h-4 w-4"
    ) do |s|
      s.path(d: "m9 18 6-6-6-6")
    end
  end
end
