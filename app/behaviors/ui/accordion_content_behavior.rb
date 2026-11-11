# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Accordion Content component
# Handles classes, ARIA attributes, and animations
module UI::AccordionContentBehavior
  # Base CSS classes for content area with animations
  # Using transition with Radix UI timing (300ms, cubic-bezier(0.87, 0, 0.13, 1))
  def content_base_classes
    "overflow-hidden text-sm transition-[height] duration-[var(--duration-accordion)] ease-[var(--ease-accordion)] data-[state=closed]:h-0"
  end

  # Merge base classes with custom classes using TailwindMerge
  def content_classes
    UI::ClassMerger.merge([content_base_classes, @classes].compact.join(" "))
  end

  # Determine initial state from context
  def content_state
    @initial_open ? "open" : "closed"
  end

  # Data attributes for Stimulus
  def content_data_attributes
    data = {ui__accordion_target: "content"}
    data[:disabled] = "" if @disabled
    data
  end

  # Merge user-provided data attributes
  def merged_content_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(content_data_attributes)
  end

  # Build complete HTML attributes hash for content container.
  # Id and aria-labelledby are wired by the accordion controller on connect.
  def content_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    attrs = base_attrs.merge(
      class: content_classes,
      role: "region",
      "data-state": content_state,
      "data-orientation": @orientation || "vertical",
      data: merged_content_data_attributes
    )

    # Add hidden attribute for closed state to prevent flash on initial load
    # JavaScript will handle the CSS variable for height
    if content_state == "closed"
      attrs[:hidden] = true
    end

    attrs
  end
end
