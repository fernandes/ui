# frozen_string_literal: true

require "tailwind_merge"

# TooltipTriggerBehavior
#
# Shared behavior for TooltipTrigger component.
# The trigger activates the tooltip on hover/focus.
# Supports asChild pattern for composition.
module UI::TooltipTriggerBehavior
  # Returns HTML attributes for the tooltip trigger element
  def tooltip_trigger_html_attributes
    as_child_value = instance_variable_defined?(:@as_child) ? @as_child : false

    attrs = {
      data: tooltip_trigger_data_attributes
    }.compact

    # Only add button styling when not using asChild
    # (asChild delegates styling to the child component)
    unless as_child_value
      attrs[:class] = tooltip_trigger_classes
    end

    attrs
  end

  # Returns combined CSS classes for the trigger button
  def tooltip_trigger_classes
    classes_value = instance_variable_defined?(:@classes) ? @classes : nil
    TailwindMerge::Merger.new.merge([
      tooltip_trigger_base_classes,
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for the tooltip trigger
  def tooltip_trigger_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    base_data = attributes_value&.fetch(:data, {}) || {}

    base_data.merge({
      ui__tooltip_target: "trigger",
      action: [base_data[:action], "mouseenter->ui--tooltip#show mouseleave->ui--tooltip#hide focus->ui--tooltip#show blur->ui--tooltip#hide"].compact.join(" ")
    }).compact
  end

  private

  # Base classes for trigger button - matches Button styling with focus ring
  def tooltip_trigger_base_classes
    [
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
      "transition-all",
      "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "h-9 px-4 py-2",
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    ].join(" ")
  end
end
