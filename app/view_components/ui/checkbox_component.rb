# frozen_string_literal: true

class UI::CheckboxComponent < ViewComponent::Base
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

  def call
    content_tag :div, class: "relative inline-flex items-center justify-center" do
      safe_join([
        content_tag(:input, nil, checkbox_html_attributes),
        checkmark_icon,
        indeterminate_icon
      ])
    end
  end

  private

  attr_reader :classes, :attributes

  def checkmark_icon
    icon("M20 6 9 17l-5-5", checkbox_check_icon_classes)
  end

  def indeterminate_icon
    icon("M5 12h14", checkbox_indeterminate_icon_classes)
  end

  def icon(path, icon_classes)
    content_tag(
      :svg,
      content_tag(:path, nil, d: path),
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      class: icon_classes
    )
  end
end
