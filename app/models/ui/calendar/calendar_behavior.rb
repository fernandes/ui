# frozen_string_literal: true

module UI
  module Calendar
    # Shared behavior for Calendar component
    # Handles Stimulus controller setup and data attributes
    module CalendarBehavior
      WEEKDAYS = %w[Su Mo Tu We Th Fr Sa].freeze

      # Generate Stimulus controller data attributes
      def calendar_data_attributes
        {
          controller: "ui--calendar",
          ui__calendar_mode_value: @mode.to_s,
          ui__calendar_selected_value: selected_json,
          ui__calendar_month_value: @month.to_s,
          ui__calendar_number_of_months_value: @number_of_months,
          ui__calendar_week_starts_on_value: @week_starts_on,
          ui__calendar_min_date_value: @min_date&.to_s,
          ui__calendar_max_date_value: @max_date&.to_s,
          ui__calendar_disabled_value: disabled_dates_json,
          ui__calendar_show_outside_days_value: @show_outside_days,
          ui__calendar_fixed_weeks_value: @fixed_weeks,
          ui__calendar_year_range_value: @year_range,
          action: "keydown->ui--calendar#handleKeydown"
        }.compact
      end

      # Build complete HTML attributes hash for calendar container
      def calendar_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        user_data = @attributes&.fetch(:data, {}) || {}
        base_attrs.merge(
          class: calendar_classes,
          data: user_data.merge(calendar_data_attributes)
        )
      end

      # Default calendar classes
      def calendar_classes
        base = "p-3"
        if @number_of_months && @number_of_months > 1
          "#{base} flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 #{@classes}".strip
        else
          "#{base} #{@classes}".strip
        end
      end

      # Convert selected dates to JSON array
      def selected_json
        case @selected
        when Date then [@selected.to_s].to_json
        when Range then [@selected.begin.to_s, @selected.end.to_s].to_json
        when Array then @selected.map(&:to_s).to_json
        else [].to_json
        end
      end

      # Convert selected dates for form value
      def selected_value
        case @selected
        when Date then @selected.to_s
        when Range then "#{@selected.begin},#{@selected.end}"
        when Array then @selected.map(&:to_s).join(",")
        else ""
        end
      end

      # Convert disabled dates to JSON array
      def disabled_dates_json
        (@disabled_dates || []).map(&:to_s).to_json
      end

      # Get weekdays ordered by week_starts_on
      def ordered_weekdays
        WEEKDAYS.rotate(@week_starts_on || 0)
      end
    end
  end
end
