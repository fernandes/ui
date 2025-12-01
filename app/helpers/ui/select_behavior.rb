# frozen_string_literal: true

# UI::SelectBehavior
#
# Shared behavior for Select component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent size styling and HTML attribute generation.
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
