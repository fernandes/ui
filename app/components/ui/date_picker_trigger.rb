# frozen_string_literal: true

    # DatePicker Trigger Phlex component
    # A button that triggers the date picker popover.
    #
    # @example Basic usage
    #   render UI::Trigger.new(placeholder: "Pick a date")
    #
    class UI::DatePickerTrigger < Phlex::HTML
      include DatePickerTriggerBehavior

      # @param placeholder [String] Placeholder text when no date selected
      # @param selected [Date, Range, Array] Currently selected date(s) for display
      # @param icon [Symbol] Icon to show: :chevron, :calendar, or :none
      # @param classes [String] Additional CSS classes
      # @param attributes [Hash] Additional HTML attributes
      def initialize(
        placeholder: "Select date",
        selected: nil,
        icon: :chevron,
        classes: "",
        **attributes
      )
        @placeholder = placeholder
        @selected = selected
        @icon = icon
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        button(**date_picker_trigger_html_attributes) do
          span(
            data: { ui__datepicker_target: "label" },
            class: "text-left truncate flex-1 #{@selected.nil? ? 'text-muted-foreground' : ''}"
          ) do
            plain display_text
          end

          render_icon if @icon != :none
        end
      end

      private

      def display_text
        return @placeholder if @selected.nil?

        case @selected
        when Date
          @selected.strftime("%B %d, %Y")
        when Range
          "#{@selected.begin.strftime('%B %d, %Y')} - #{@selected.end.strftime('%B %d, %Y')}"
        when Array
          if @selected.empty?
            @placeholder
          elsif @selected.length == 1
            @selected.first.strftime("%B %d, %Y")
          else
            "#{@selected.length} dates selected"
          end
        else
          @placeholder
        end
      end

      def render_icon
        if @icon == :chevron
          raw chevron_down_icon
        elsif @icon == :calendar
          raw calendar_icon
        end
      end
    end
