class UI::Calendar < UI::Base
  def initialize(month:, year:, weeks: nil, active_day: 0, jump_amount: 0, selected_value: nil, **user_attrs)
    @month = month
    @year = year
    @selected_value = selected_value
    @calendar = UI::CalendarCalculator.new(
      month: month,
      year: year,
      active_day: active_day,
      jump_amount: jump_amount,
      selected_value: selected_value
    )
    @calendar_weeks = weeks
    @active_day = @calendar.active_day
    super(**user_attrs)
  end

  def view_template
    data = {
      controller: :ui__calendar,
      ui__calendar: {
        selected_value: @selected_value,
        month_value: @month,
        year_value: @year,
        next_period_month_value: @calendar.next_period.month,
        next_period_year_value: @calendar.next_period.year,
        previous_period_month_value: @calendar.previous_period.month,
        previous_period_year_value: @calendar.previous_period.year,
        active_day_value: @active_day
      },
      action: [
        "keydown.up->ui--calendar#handleKeyUp:stop",
        "keydown.down->ui--calendar#handleKeyDown:stop",
        "keydown.right->ui--calendar#handleKeyRight:stop",
        "keydown.left->ui--calendar#handleKeyLeft:stop",
        "keydown.page_up->ui--calendar#handleKeyPageUp:stop",
        "keydown.page_down->ui--calendar#handleKeyPageDown:stop",
      ]
    }
    div(class: "rdp p-3 rounded-md border", data: data) do
      div(class: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0") do
        div(class: "space-y-4 rdp-caption_start rdp-caption_end") do
          header(@calendar.title)
          table(
            class: "w-full border-collapse space-y-1",
            role: "grid",
            aria_labelledby: "react-day-picker-8"
          ) do
            thead(class: "rdp-head") do
              tr(class: "flex") do
                weekday_name(text: "Su", label: "Sunday")
                weekday_name(text: "Mo", label: "Monday")
                weekday_name(text: "Tu", label: "Tuesday")
                weekday_name(text: "We", label: "Wednesday")
                weekday_name(text: "Th", label: "Thursday")
                weekday_name(text: "Fr", label: "Friday")
                weekday_name(text: "Sa", label: "Saturday")
              end
            end
            tbody(class: "rdp-tbody", role: "rowgroup") do
              @calendar.weeks(@calendar_weeks) do |week|
                tr(class: "flex w-full mt-2") do
                  week.each_pair do |dow, value|
                    send(:"render_#{value[:role]}", value[:day])
                  end
                end
              end
            end
          end
        end
      end
    end
  end

  def header(title)
    div(class: "flex justify-center pt-1 relative items-center") do
      div(
        class: "text-sm font-medium",
        aria_live: "polite",
        role: "presentation",
        id: "react-day-picker-8"
      ) { title }
      div(class: "space-x-1 flex items-center") do
        button(
          data: {
            ui__calendar_target: :previousButton,
            action: [
              "click->ui--calendar#handleClickPreviousPeriod"
            ]
          },
          name: "previous-month",
          aria_label: "Go to previous month",
          class:
            "rdp-button_reset rdp-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1",
          type: "button"
        ) do
          render UI::Icon.new(:chevron_left, class: "h-4 w-4")
        end
        button(
          data: {
            ui__calendar_target: :nextButton,
            action: [
              "click->ui--calendar#handleClickNextPeriod"
            ]
          },
          name: "next-month",
          aria_label: "Go to next month",
          class:
            "rdp-button_reset rdp-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1",
          type: "button"
        ) do
          render UI::Icon.new(:chevron_right, class: "h-4 w-4")
        end
      end
    end
  end

  def weekday_name(text:, label:)
    th(
      scope: "col",
      class:
        "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
      aria_label: label
    ) { text }
  end

  def button_day(day, status: :active)
    td(
      class:
        "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",

      role: "presentation"
    ) do
      button(
        name: "day",
        data: {
          ui__calendar_target: :buttonDay,
          status: status,
          value: day,
          action: [
            "click->ui--calendar#handleButtonDayClick",
          ],
        },
        class:
        [
          day_classes,
          ("day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground" if status == :inactive),
          ("bg-accent text-accent-foreground" if status == :today),
          ("bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground" if status == :selected)
        ],
        role: "gridcell",
        tabindex: ((status == :today && @active_day == 0) ? "0" : "-1"),
        type: "button"
      ) { day }
    end
  end

  def render_outside(day)
    button_day(day, status: :inactive)
  end

  def render_selected(day)
    button_day(day, status: :selected)
  end

  def render_inside(day)
    button_day(day)
  end

  def render_today(day)
    button_day(day, status: :today)
  end

  private

  def day_classes
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100"
  end
end
