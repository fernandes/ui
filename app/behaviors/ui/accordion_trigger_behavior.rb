# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Accordion Trigger (button) component
# Handles classes and ARIA attributes. Ids and aria-controls are wired by the
# accordion controller on connect (an id passed in attributes is kept).
module UI::AccordionTriggerBehavior
  # Base CSS classes for trigger button
  def trigger_base_classes
    "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:underline [&[data-state=open]>svg]:rotate-180"
  end

  # Merge base classes with custom classes using TailwindMerge
  def trigger_classes
    UI::ClassMerger.merge([trigger_base_classes, "disabled:pointer-events-none disabled:opacity-50", @classes].compact.join(" "))
  end

  # Determine initial state from context
  def trigger_state
    @initial_open ? "open" : "closed"
  end

  # Determine aria-expanded value
  def aria_expanded
    @initial_open ? "true" : "false"
  end

  # Data attributes for Stimulus
  def trigger_data_attributes
    data = {
      ui__accordion_target: "trigger",
      action: "click->ui--accordion#toggle"
    }
    data[:disabled] = "" if @disabled
    data
  end

  # Merge user-provided data attributes
  def merged_trigger_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(trigger_data_attributes)
  end

  # Build complete HTML attributes hash for trigger button
  def trigger_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: trigger_classes,
      type: "button",
      "aria-expanded": aria_expanded,
      disabled: @disabled || false,
      "data-state": trigger_state,
      "data-orientation": @orientation || "vertical",
      data: merged_trigger_data_attributes
    )
  end

  # SVG caret icon (rotation handled by Tailwind's [&[data-state=open]>svg] variant)
  def caret_svg
    <<~SVG.html_safe
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-[var(--duration-accordion)]">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    SVG
  end
end
