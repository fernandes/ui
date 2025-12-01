# frozen_string_literal: true

# DatePicker Input Phlex component
# An input field with calendar button for date picker.
#
# @example Basic usage
#   render UI::Input.new(placeholder: "June 01, 2025")
#
class UI::DatePickerInput < Phlex::HTML
  include DatePickerInputBehavior

  # @param placeholder [String] Placeholder text
  # @param value [String] Initial input value
  # @param id [String] Input ID for label association
  # @param classes [String] Additional CSS classes for input
  # @param icon_classes [String] Additional CSS classes for icon button
  # @param attributes [Hash] Additional HTML attributes
  def initialize(
    placeholder: "Select date",
    value: "",
    id: nil,
    classes: "",
    icon_classes: "",
    **attributes
  )
    @placeholder = placeholder
    @value = value
    @id = id
    @classes = classes
    @icon_classes = icon_classes
    @attributes = attributes
  end

  def view_template
    div(class: "relative flex gap-2") do
      input_attrs = date_picker_input_html_attributes
      input_attrs[:id] = @id if @id
      input(**input_attrs)

      button(
        type: "button",
        class: date_picker_icon_button_classes,
        data: {
          ui__datepicker_target: "trigger",
          ui__popover_target: "trigger"
        }
      ) do
        render_calendar_icon
        span(class: "sr-only") { "Select date" }
      end
    end
  end

  private

  def render_calendar_icon
    svg(
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      stroke_width: "2",
      stroke_linecap: "round",
      stroke_linejoin: "round",
      class: "h-4 w-4 opacity-50"
    ) do |s|
      s.path(d: "M8 2v4")
      s.path(d: "M16 2v4")
      s.rect(width: "18", height: "18", x: "3", y: "4", rx: "2")
      s.path(d: "M3 10h18")
    end
  end
end
