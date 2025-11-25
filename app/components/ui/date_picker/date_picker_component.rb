# frozen_string_literal: true

module UI
  module DatePicker
    # DatePicker ViewComponent
    # A date picker that combines a popover trigger with a calendar.
    #
    # @example Basic usage
    #   render UI::DatePicker::DatePickerComponent.new do |dp|
    #     dp.with_trigger(placeholder: "Pick a date")
    #   end
    #
    class DatePickerComponent < ViewComponent::Base
      include DatePickerBehavior

      renders_one :trigger, ->(placeholder: @placeholder, selected: @selected, icon: :chevron, classes: "", **attributes) do
        TriggerComponent.new(
          placeholder: placeholder,
          selected: selected,
          icon: icon,
          classes: classes,
          **attributes
        )
      end

      # @param mode [Symbol] Selection mode: :single, :range, :multiple
      # @param selected [Date, Range, Array] Initially selected date(s)
      # @param locale [String] BCP 47 locale tag for formatting
      # @param format [String] Date format style: "short", "medium", "long", "full"
      # @param placeholder [String] Placeholder text when no date selected
      # @param range_placeholder [String] Placeholder for range mode
      # @param close_on_select [Boolean] Close popover after selection
      # @param name [String] Form field name for hidden input
      # @param label [String] Label text for the date picker
      # @param label_for [String] ID to associate label with input
      # @param show_dropdowns [Boolean] Show month/year dropdowns in calendar
      # @param min_date [Date] Minimum selectable date
      # @param max_date [Date] Maximum selectable date
      # @param disabled_dates [Array<Date>] Dates that cannot be selected
      # @param number_of_months [Integer] Number of months to display
      # @param week_starts_on [Integer] 0 for Sunday, 1 for Monday, etc.
      # @param classes [String] Additional CSS classes
      # @param attributes [Hash] Additional HTML attributes
      def initialize(
        mode: :single,
        selected: nil,
        locale: "en-US",
        format: "long",
        placeholder: "Select date",
        range_placeholder: "Select date range",
        close_on_select: true,
        name: nil,
        label: nil,
        label_for: nil,
        show_dropdowns: false,
        min_date: nil,
        max_date: nil,
        disabled_dates: [],
        number_of_months: 1,
        week_starts_on: 0,
        classes: "",
        **attributes
      )
        @mode = mode
        @selected = selected
        @locale = locale
        @format = format
        @placeholder = placeholder
        @range_placeholder = range_placeholder
        @close_on_select = close_on_select
        @name = name
        @label = label
        @label_for = label_for
        @show_dropdowns = show_dropdowns
        @min_date = min_date
        @max_date = max_date
        @disabled_dates = disabled_dates
        @number_of_months = number_of_months
        @week_starts_on = week_starts_on
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, date_picker_html_attributes do
          safe_join([
            render_label,
            render_popover,
            render_hidden_input
          ].compact)
        end
      end

      private

      def render_label
        return unless @label

        render UI::Label::LabelComponent.new(for_field: @label_for, classes: "px-1") do
          @label
        end
      end

      def render_popover
        render UI::Popover::PopoverComponent.new(trigger: "click", placement: "bottom-start", offset: 4) do |popover|
          safe_join([
            trigger,
            render_popover_content
          ])
        end
      end

      def render_popover_content
        render UI::Popover::ContentComponent.new(classes: "w-auto overflow-hidden p-0") do
          render UI::Calendar::CalendarComponent.new(
            mode: @mode,
            selected: @selected,
            locale: @locale,
            show_dropdowns: @show_dropdowns,
            min_date: @min_date,
            max_date: @max_date,
            disabled_dates: @disabled_dates,
            number_of_months: @number_of_months,
            week_starts_on: @week_starts_on,
            attributes: {
              data: {
                action: "ui--calendar:select->ui--datepicker#handleSelect"
              }
            }
          )
        end
      end

      def render_hidden_input
        return unless @name

        hidden_field_tag @name, selected_value, data: { ui__datepicker_target: "hiddenInput" }
      end
    end
  end
end
