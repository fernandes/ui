# frozen_string_literal: true

# DatePicker Input ViewComponent
# An input field with calendar button for date picker.
#
# @example Basic usage
#   render UI::InputComponent.new(placeholder: "June 01, 2025")
#
class UI::DatePickerInputComponent < ViewComponent::Base
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

  def call
    content_tag :div, class: "relative flex gap-2" do
      safe_join([
        render_input,
        render_button
      ])
    end
  end

  private

  def render_input
    input_attrs = date_picker_input_html_attributes
    input_attrs[:id] = @id if @id
    tag.input(**input_attrs)
  end

  def render_button
    content_tag :button,
      type: "button",
      class: date_picker_icon_button_classes,
      data: {
        ui__datepicker_target: "trigger",
        ui__popover_target: "trigger"
      } do
      safe_join([
        calendar_icon,
        content_tag(:span, "Select date", class: "sr-only")
      ])
    end
  end

  def calendar_icon
    <<~SVG.html_safe
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 opacity-50">
        <path d="M8 2v4"/>
        <path d="M16 2v4"/>
        <rect width="18" height="18" x="3" y="4" rx="2"/>
        <path d="M3 10h18"/>
      </svg>
    SVG
  end
end
