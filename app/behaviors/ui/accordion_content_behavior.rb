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
    TailwindMerge::Merger.new.merge([content_base_classes, @classes].compact.join(" "))
  end

  # Generate unique IDs for ARIA relationships (matching trigger)
  def trigger_id
    @trigger_id ||= "accordion-trigger-#{item_value}"
  end

  def content_id
    @content_id ||= "accordion-content-#{item_value}"
  end

  # Get item value from context (set by parent AccordionItem)
  def item_value
    @item_value || SecureRandom.hex(4)
  end

  # Determine initial state from context
  def content_state
    @initial_open ? "open" : "closed"
  end

  # Data attributes for Stimulus
  def content_data_attributes
    {
      ui__accordion_target: "content"
    }
  end

  # Merge user-provided data attributes
  def merged_content_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(content_data_attributes)
  end

  # Build complete HTML attributes hash for content container
  def content_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    attrs = base_attrs.merge(
      class: content_classes,
      id: content_id,
      role: "region",
      "aria-labelledby": trigger_id,
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
