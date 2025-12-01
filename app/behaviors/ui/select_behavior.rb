# frozen_string_literal: true

# UI::SelectBehavior
#
# Shared behavior for Select component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent size styling and HTML attribute generation.
#
# @ui_component Select
# @ui_description Displays a list of options for the user to pick from, triggered by a button.
# @ui_category forms
#
# @ui_anatomy Select - Root container with state management (required)
# @ui_anatomy Trigger - Button that opens the dropdown (required)
# @ui_anatomy Content - Container for the dropdown options (required)
# @ui_anatomy Item - Individual selectable option (required)
# @ui_anatomy Group - Groups related items with a label
# @ui_anatomy Label - Label for item groups
# @ui_anatomy Separator - Visual separator between items
#
# @ui_feature Single selection from a list of options
# @ui_feature Keyboard navigation with arrow keys
# @ui_feature Type-ahead search functionality
# @ui_feature Grouped options with labels
# @ui_feature Disabled items support
# @ui_feature Custom trigger with asChild pattern
# @ui_feature Placeholder text when no selection
# @ui_feature Form integration with hidden input
#
# @ui_data_attr data-state ["open", "closed"] Current open/closed state
# @ui_data_attr data-placeholder ["true"] Present when showing placeholder
#
# @ui_css_var --trigger-width Width of the trigger element
#
# @ui_aria_pattern Listbox
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
# @ui_aria_attr role="combobox" on the trigger
# @ui_aria_attr role="listbox" on the content container
# @ui_aria_attr role="option" on each item
# @ui_aria_attr aria-expanded on trigger
# @ui_aria_attr aria-selected on the selected item
# @ui_aria_attr aria-disabled on disabled items
# @ui_aria_attr aria-labelledby for label association
#
# @ui_keyboard Space Opens dropdown when trigger is focused
# @ui_keyboard Enter Opens dropdown / selects highlighted item
# @ui_keyboard ArrowDown Opens dropdown / moves to next item
# @ui_keyboard ArrowUp Moves to previous item
# @ui_keyboard Home Moves to first item
# @ui_keyboard End Moves to last item
# @ui_keyboard Escape Closes dropdown
# @ui_keyboard A-Z,a-z Type-ahead to find matching item
#
# @ui_related combobox
# @ui_related dropdown_menu
# @ui_related radio_group
#
module UI::SelectBehavior
  # Returns HTML attributes for the select element
  def select_html_attributes
    data_attrs = {
      controller: "ui--select",
      ui__select_open_value: "false"
    }

    # Add value if provided
    if @value.present?
      data_attrs[:ui__select_value_value] = @value.to_s
    end

    attrs = {
      class: select_classes,
      data: data_attrs
    }

    # Add data-placeholder attribute if there's a placeholder and no selected value
    if @placeholder.present? && @selected.nil?
      attrs[:"data-placeholder"] = "true"
    end

    attrs.compact
  end

  # Returns combined CSS classes for the select
  def select_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      select_base_classes,
      select_size_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes applied to all selects
  # The select container is just a wrapper for Stimulus controller
  # All visual styling is on the trigger button
  # h-fit prevents wrapper from expanding to include absolutely positioned content
  def select_base_classes
    "relative h-fit"
  end

  # Size-specific classes based on @size
  # No size classes needed on container, they go on trigger
  def select_size_classes
    ""
  end

  # Renders options for the select element
  # Handles both array format [label, value] and hash format { label: x, value: y }
  def render_options
    return "" if @options.nil?

    @options.map do |option|
      label, value = extract_option_values(option)
      selected = (@selected.to_s == value.to_s) ? "selected" : nil

      {label: label, value: value, selected: selected}
    end
  end

  # Extracts label and value from different option formats
  def extract_option_values(option)
    if option.is_a?(Array)
      [option[0], option[1]]
    elsif option.is_a?(Hash)
      label = option[:label] || option["label"]
      value = option[:value] || option["value"]
      [label, value]
    else
      [option, option]
    end
  end
end
