# frozen_string_literal: true

    # Shared behavior for Calendar component
    # Handles Stimulus controller setup and data attributes
    module UI::CalendarBehavior
      WEEKDAYS = %w[Su Mo Tu We Th Fr Sa].freeze

      # Generate Stimulus controller data attributes
      def calendar_data_attributes
        attrs = {
          controller: "ui--calendar",
          ui__calendar_mode_value: @mode.to_s,
          ui__calendar_selected_value: selected_json,
          ui__calendar_month_value: @month.to_s,
          ui__calendar_number_of_months_value: @number_of_months,
          ui__calendar_week_starts_on_value: @week_starts_on,
          ui__calendar_locale_value: @locale,
          ui__calendar_min_date_value: @min_date&.to_s,
          ui__calendar_max_date_value: @max_date&.to_s,
          ui__calendar_disabled_value: disabled_dates_json,
          ui__calendar_show_outside_days_value: @show_outside_days,
          ui__calendar_fixed_weeks_value: @fixed_weeks,
          ui__calendar_year_range_value: @year_range,
          # Range constraints
          ui__calendar_min_range_days_value: @min_range_days,
          ui__calendar_max_range_days_value: @max_range_days,
          ui__calendar_exclude_disabled_value: @exclude_disabled,
          action: "keydown->ui--calendar#handleKeydown"
        }

        # Add UI Select controller if using custom select
        if @show_dropdowns && !use_native_select?
          attrs[:controller] = "ui--calendar ui--select-calendar-sync"
        end

        attrs.compact
      end

      def use_native_select?
        @use_native_select.nil? ? true : @use_native_select
      end

      # Build complete HTML attributes hash for calendar container
      def calendar_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        user_data = @attributes&.fetch(:data, {}) || {}

        # Merge data attributes, concatenating action values
        merged_data = calendar_data_attributes.merge(user_data) do |key, calendar_val, user_val|
          if key == :action
            # Concatenate Stimulus actions with space separator
            [calendar_val, user_val].compact.join(" ")
          else
            user_val
          end
        end

        base_attrs.merge(
          class: calendar_classes,
          role: "application",
          aria: {
            label: aria_label_text
          },
          data: merged_data
        )
      end

      # Generate aria-label based on mode
      def aria_label_text
        case @mode.to_s
        when "range"
          "Date range picker"
        when "multiple"
          "Multiple date picker"
        else
          "Date picker"
        end
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
