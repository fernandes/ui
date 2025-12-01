# frozen_string_literal: true

# UI::RadioButtonBehavior
#
# @ui_component Radio Button
# @ui_category forms
#
# @ui_anatomy Radio Button - Root container for radio button (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Disabled state support
# @ui_feature ARIA attributes for accessibility
#
# @ui_aria_pattern Radio Group
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/radio/
#
# @ui_related toggle_group
# @ui_related checkbox
# @ui_related select
#
module UI::RadioButtonBehavior
  def radio_button_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      type: "radio",
      class: radio_button_classes,
      name: @name,
      id: radio_button_id,
      value: @value,
      checked: (@checked ? true : nil),
      disabled: (@disabled ? true : nil),
      required: (@required ? true : nil),
      data: radio_button_data_attributes
    }.merge(attributes_value).compact
  end

  def radio_button_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      radio_button_base_classes,
      classes_value

    ].compact.join(" "))
  end

  def radio_button_data_attributes
    {
      slot: "radio-group-item"
    }
  end

  def radio_button_id
    @id || "radio-#{SecureRandom.hex(4)}"
  end

  private

  def radio_button_base_classes
    "peer appearance-none border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
  end
end
