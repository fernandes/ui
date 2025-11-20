# frozen_string_literal: true

# UI::SelectItemBehavior
#
# Shared behavior for Individual select option across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::SelectItemBehavior
    # Returns HTML attributes for the select item element
    def select_item_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      attrs = {
        class: select_item_classes,
        role: "option",
        "aria-selected": "false",
        data: {
          ui__select_target: "item",
          action: "click->ui--select#selectItem mouseenter->ui--select#handleItemMouseEnter mouseleave->ui--select#handleItemMouseLeave",
          value: @value,
          slot: "select-item" # ADDED: data-slot attribute
        }
      }

      # Add disabled state if specified
      if @disabled
        attrs[:data][:disabled] = "true"
        attrs[:"aria-disabled"] = "true"
        attrs[:data][:state] = "disabled"
      end

      attrs.merge(attributes_value || {})
    end

    # Returns combined CSS classes
    def select_item_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        select_item_base_classes,
        classes_value
      ].compact.join(" "))
    end

    private

    # Base classes for select item
    def select_item_base_classes
      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
    end
  end
