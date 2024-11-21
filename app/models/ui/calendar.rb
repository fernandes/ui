class UI::Calendar < UI::Base
  def initialize(weeks: nil, **user_attrs)
    @calendar = UI::CalendarCalculator.new(month: 11, year: 2024)
    @calendar_weeks = weeks
    super(**user_attrs)
  end

  def view_template
    @calendar =
      div(class: "rdp p-3 rounded-md border") do
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
          name: "previous-month",
          aria_label: "Go to previous month",
          class:
            "rdp-button_reset rdp-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1",
          type: "button"
        ) do
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewbox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            class: "lucide lucide-chevron-left h-4 w-4"
          ) { |s| s.path(d: "m15 18-6-6 6-6") }
        end
        button(
          name: "next-month",
          aria_label: "Go to next month",
          class:
            "rdp-button_reset rdp-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1",
          type: "button"
        ) do
          svg(
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewbox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            stroke_width: "2",
            stroke_linecap: "round",
            stroke_linejoin: "round",
            class: "lucide lucide-chevron-right h-4 w-4"
          ) { |s| s.path(d: "m9 18 6-6-6-6") }
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
        class:
        [
          day_classes,
          ("day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground" if status == :inactive),
          ("bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground bg-accent" if status == :today)
        ],
        role: "gridcell",
        tabindex: "-1",
        type: "button"
      ) { day }
    end
  end

  def render_outside(day)
    button_day(day, status: :inactive)
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
