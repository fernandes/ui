# frozen_string_literal: true

# UI::SwitchBehavior
#
# @ui_component Switch
# @ui_description Switch - Phlex implementation
# @ui_category forms
#
# @ui_anatomy Switch - A toggle control that allows the user to switch between checked and unchecked states. (required)
#
# @ui_feature Keyboard navigation
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Form integration
# @ui_feature Disabled state support
# @ui_feature ARIA attributes for accessibility
# @ui_feature Animation support
#
# @ui_aria_pattern Switch
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/switch/
# @ui_aria_attr aria-checked
# @ui_aria_attr aria-disabled
# @ui_aria_attr role="switch"
#
# @ui_keyboard Enter Activates the focused element
# @ui_keyboard Space Activates the focused element
#
# @ui_related checkbox
# @ui_related toggle
#
module UI::SwitchBehavior
# Returns HTML attributes for the switch button element
def switch_html_attributes
  {
    class: switch_classes,
    role: "switch",
    type: "button",
    tabindex: @disabled ? -1 : 0,
    "aria-checked": switch_aria_checked,
    "data-state": switch_state,
    "data-slot": "switch",
    data: switch_data_attributes
  }.tap do |attrs|
    if @disabled
      attrs[:disabled] = true
      attrs["aria-disabled"] = "true"
    end
  end
end

# Returns combined CSS classes for the switch
def switch_classes
  classes_value = respond_to?(:classes, true) ? classes : @classes
  TailwindMerge::Merger.new.merge([
    switch_base_classes,
    classes_value
  ].compact.join(" "))
end

# Returns CSS classes for the thumb element
def switch_thumb_classes
  "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
end

private

# Base classes applied to all switches
def switch_base_classes
  "peer data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
end

# Returns the switch state (checked or unchecked)
def switch_state
  @checked ? "checked" : "unchecked"
end

# Returns aria-checked attribute value
def switch_aria_checked
  @checked.to_s
end

# Returns data attributes for Stimulus controller
def switch_data_attributes
  {
    controller: "ui--switch",
    ui__switch_checked_value: @checked,
    action: "click->ui--switch#toggle keydown->ui--switch#handleKeydown"
  }
end
end
