# frozen_string_literal: true

require "tailwind_merge"

# Shared behavior for Accordion Item component
# Handles classes, states, and data attributes
module UI::AccordionItemBehavior
  # Base CSS classes for accordion item
  def item_base_classes
    "border-b border-border last:border-b-0"
  end

  # Merge base classes with custom classes using TailwindMerge
  def item_classes
    TailwindMerge::Merger.new.merge([item_base_classes, @classes].compact.join(" "))
  end

  # Data attributes for Stimulus target
  def item_data_attributes
    {
      ui__accordion_target: "item",
      value: @value || ""
    }
  end

  # Merge user-provided data attributes
  def merged_item_data_attributes
    user_data = @attributes&.fetch(:data, {}) || {}
    user_data.merge(item_data_attributes)
  end

  # Determine initial state
  def item_state
    @initial_open ? "open" : "closed"
  end

  # Build complete HTML attributes hash for accordion item
  def item_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      class: item_classes,
      "data-state": item_state,
      "data-orientation": @orientation || "vertical",
      data: merged_item_data_attributes
    )
  end
end
