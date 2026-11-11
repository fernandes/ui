# frozen_string_literal: true

class UI::Checkbox < Phlex::HTML
  include UI::CheckboxBehavior

  def initialize(
    name: nil,
    id: nil,
    value: nil,
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    classes: "",
    **attributes
  )
    @name = name
    @id = id
    @value = value
    @checked = checked
    @indeterminate = indeterminate
    @disabled = disabled
    @required = required
    @classes = classes
    @attributes = attributes
  end

  def view_template
    div(class: "relative inline-flex items-center justify-center") do
      input(**checkbox_html_attributes)
      checkmark_icon
      indeterminate_icon
    end
  end

  private

  def checkmark_icon
    svg(
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      stroke_width: "2",
      stroke_linecap: "round",
      stroke_linejoin: "round",
      aria_hidden: "true",
      class: checkbox_check_icon_classes
    ) { |s| s.path(d: "M20 6 9 17l-5-5") }
  end

  def indeterminate_icon
    svg(
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      stroke_width: "2",
      stroke_linecap: "round",
      stroke_linejoin: "round",
      aria_hidden: "true",
      class: checkbox_indeterminate_icon_classes
    ) { |s| s.path(d: "M5 12h14") }
  end
end
