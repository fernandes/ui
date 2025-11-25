# frozen_string_literal: true

module UI
  module DatePicker
    # DatePicker Trigger ViewComponent
    # A button that triggers the date picker popover.
    #
    # @example Basic usage
    #   render UI::DatePicker::TriggerComponent.new(placeholder: "Pick a date")
    #
    class TriggerComponent < ViewComponent::Base
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

      def call
        content_tag :button, date_picker_trigger_html_attributes do
          safe_join([
            render_label,
            render_icon
          ].compact)
        end
      end

      private

      def render_label
        content_tag :span,
                    display_text,
                    data: { ui__datepicker_target: "label" },
                    class: "text-left truncate flex-1 #{@selected.nil? ? 'text-muted-foreground' : ''}"
      end

      def render_icon
        return if @icon == :none

        if @icon == :chevron
          chevron_down_icon
        elsif @icon == :calendar
          calendar_icon
        end
      end

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
    end
  end
end
