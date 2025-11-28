# frozen_string_literal: true

    # Calendar component (ViewComponent)
    # A date picker calendar with support for single, range, and multiple selection
    class UI::CalendarComponent < ViewComponent::Base
      include UI::CalendarBehavior

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
        attributes: {}
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

      def call
        content_tag(:div, **calendar_html_attributes) do
          safe_join([
            live_region_html,
            hidden_input,
            months_html
          ].compact)
        end
      end

      private

      def live_region_html
        tag.div("", class: "sr-only", "aria-live": "polite", "aria-atomic": "true", data: { ui__calendar_target: "liveRegion" })
      end

      def hidden_input
        return unless @name

        tag.input(type: "hidden", name: @name, value: selected_value, data: { ui__calendar_target: "input" })
      end

      def months_html
        safe_join(@number_of_months.times.map { |i| month_html(i) })
      end

      def month_html(index)
        content_tag(:div, class: "space-y-4") do
          safe_join([header_html(index), table_html])
        end
      end

      def header_html(_index)
        content_tag(:div, class: "flex justify-center pt-1 relative items-center") do
          safe_join([
            nav_button(:previous),
            @show_dropdowns ? dropdowns_html : month_label_html,
            nav_button(:next)
          ])
        end
      end

      def nav_button(direction)
        action = direction == :previous ? "previousMonth" : "nextMonth"
        label = direction == :previous ? "Go to previous month" : "Go to next month"
        position = direction == :previous ? "left" : "right"

        content_tag(:button,
          type: "button",
          data: { action: "click->ui--calendar##{action}" },
          class: nav_button_classes(position),
          "aria-label": label
        ) do
          direction == :previous ? chevron_left_svg : chevron_right_svg
        end
      end

      def nav_button_classes(position)
        base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium " \
               "ring-offset-background transition-colors " \
               "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " \
               "border border-input bg-background hover:bg-accent hover:text-accent-foreground " \
               "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        position_class = position == "left" ? "absolute left-1" : "absolute right-1"
        "#{base} #{position_class}"
      end

      def month_label_html
        content_tag(:div, "", class: "text-sm font-medium", data: { ui__calendar_target: "monthLabel" })
      end

      def dropdowns_html
        content_tag(:div, class: "flex items-center gap-1") do
          safe_join([month_select_html, year_select_html])
        end
      end

      def month_select_html
        content_tag(:select,
          data: { ui__calendar_target: "monthSelect", action: "change->ui--calendar#goToMonth" },
          class: "text-sm font-medium h-7 px-2 rounded-md border border-input bg-background"
        ) do
          safe_join(Date::MONTHNAMES.compact.each_with_index.map { |name, i| tag.option(name, value: i) })
        end
      end

      def year_select_html
        current_year = Date.today.year
        content_tag(:select,
          data: { ui__calendar_target: "yearSelect", action: "change->ui--calendar#goToYear" },
          class: "text-sm font-medium h-7 px-2 rounded-md border border-input bg-background"
        ) do
          safe_join(((current_year - @year_range)..(current_year + 10)).map { |y| tag.option(y.to_s, value: y) })
        end
      end

      def table_html
        content_tag(:table, class: "w-full border-collapse space-y-1", role: "grid") do
          safe_join([
            content_tag(:thead) { weekdays_html },
            content_tag(:tbody, "", data: { ui__calendar_target: "grid" }, role: "rowgroup")
          ])
        end
      end

      def weekdays_html
        content_tag(:tr, class: "flex", data: { ui__calendar_target: "weekdaysHeader" }) do
          safe_join(ordered_weekdays.map { |day| tag.th(day, scope: "col", class: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]") })
        end
      end

      def chevron_left_svg
        tag.svg(
          xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
          viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
          "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round",
          class: "h-4 w-4"
        ) do
          tag.path(d: "m15 18-6-6 6-6")
        end
      end

      def chevron_right_svg
        tag.svg(
          xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16",
          viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
          "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round",
          class: "h-4 w-4"
        ) do
          tag.path(d: "m9 18 6-6-6-6")
        end
      end
    end
