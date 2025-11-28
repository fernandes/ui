# frozen_string_literal: true

    # Shared behavior for DatePicker container component
    # Handles Stimulus controller setup and data attributes
    module UI::DatePickerBehavior
      # Generate Stimulus controller data attributes
      def date_picker_data_attributes
        attrs = {
          controller: "ui--datepicker",
          ui__datepicker_mode_value: @mode.to_s,
          ui__datepicker_selected_value: selected_json,
          ui__datepicker_locale_value: @locale,
          ui__datepicker_format_value: @format,
          ui__datepicker_placeholder_value: @placeholder,
          ui__datepicker_range_placeholder_value: @range_placeholder,
          ui__datepicker_close_on_select_value: @close_on_select
        }
        attrs.compact
      end

      # Build complete HTML attributes hash for datepicker container
      def date_picker_html_attributes
        base_attrs = @attributes&.except(:data) || {}
        user_data = @attributes&.fetch(:data, {}) || {}
        base_attrs.merge(
          class: date_picker_classes,
          data: user_data.merge(date_picker_data_attributes)
        )
      end

      # Default datepicker classes
      def date_picker_classes
        TailwindMerge::Merger.new.merge([
          "flex flex-col gap-3",
          @classes
        ].compact.join(" "))
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

      # Get initial display value
      def initial_display_value
        return placeholder_text if @selected.nil?

        case @selected
        when Date
          format_date(@selected)
        when Range
          "#{format_date(@selected.begin)} - #{format_date(@selected.end)}"
        when Array
          if @selected.empty?
            placeholder_text
          elsif @selected.length == 1
            format_date(@selected.first)
          else
            "#{@selected.length} dates selected"
          end
        else
          placeholder_text
        end
      end

      def placeholder_text
        @mode.to_s == "range" ? @range_placeholder : @placeholder
      end

      def format_date(date)
        return "" unless date

        date.strftime("%B %d, %Y")
      end
    end
