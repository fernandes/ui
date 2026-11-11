# frozen_string_literal: true

# UI::CheckboxBehavior
#
# @ui_component Checkbox
# @ui_category forms
#
# @ui_anatomy Checkbox - Root checkbox element (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Disabled state support
# @ui_feature Indeterminate ("mixed") state
# @ui_feature Native checkbox semantics (no aria-checked needed)
#
# @ui_aria_pattern Checkbox
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
#
# @ui_related switch
# @ui_related toggle
# @ui_related radio_button
#
module UI::CheckboxBehavior
  def checkbox_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      type: "checkbox",
      class: checkbox_classes,
      name: @name,
      id: checkbox_id,
      value: @value,
      checked: (@checked ? true : nil),
      disabled: (@disabled ? true : nil),
      required: (@required ? true : nil),
      data: checkbox_data_attributes
    }.deep_merge(attributes_value).compact
  end

  def checkbox_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    UI::ClassMerger.merge([
      checkbox_base_classes,
      classes_value

    ].compact.join(" "))
  end

  def checkbox_data_attributes
    {
      controller: "ui--checkbox",
      state: checkbox_state,
      indeterminate: (checkbox_indeterminate? ? "true" : nil)
    }.compact
  end

  # A native checkbox has no HTML attribute for "mixed": the controller sets
  # the `indeterminate` property from `data-indeterminate` on connect, and the
  # browser then exposes aria-checked="mixed" by itself.
  def checkbox_state
    return "indeterminate" if checkbox_indeterminate?

    @checked ? "checked" : "unchecked"
  end

  def checkbox_indeterminate?
    @indeterminate ? true : false
  end

  def checkbox_check_icon_classes
    "size-3.5 pointer-events-none absolute text-primary-foreground opacity-0 peer-[:checked:not([data-state=indeterminate])]:opacity-100 transition-opacity"
  end

  def checkbox_indeterminate_icon_classes
    "size-3.5 pointer-events-none absolute text-primary-foreground opacity-0 peer-data-[state=indeterminate]:opacity-100 transition-opacity"
  end

  def checkbox_id
    @id || "checkbox-#{SecureRandom.hex(4)}"
  end

  private

  def checkbox_base_classes
    "peer appearance-none border-input dark:bg-input/30 checked:bg-primary checked:text-primary-foreground dark:checked:bg-primary checked:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground dark:data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
  end
end
