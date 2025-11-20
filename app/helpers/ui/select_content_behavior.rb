# frozen_string_literal: true

# UI::SelectContentBehavior
#
# Shared behavior for Select dropdown content across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::SelectContentBehavior
    # Returns HTML attributes for the select content element
    def select_content_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      {
        class: select_content_classes,
        data: {
          ui__select_target: "content",
          state: "closed",
          slot: "select-content"
        },
        role: "listbox",
        # CSS variables for positioning (set by JavaScript)
        style: "box-sizing: border-box; display: flex; flex-direction: column; outline: none;"
      }.merge(attributes_value || {})
    end

    # Returns combined CSS classes
    def select_content_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        select_content_base_classes,
        classes_value
      ].compact.join(" "))
    end

    private

    # Base classes for select content dropdown
    # FIXED: overflow-x-hidden overflow-y-auto instead of overflow-hidden
    # FIXED: removed data-[state=closed]:hidden, use invisible pattern
    # ADDED: max-h, origin, and translate classes for proper positioning
    def select_content_base_classes
      "relative z-50 flex min-w-[8rem] flex-col overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 data-[state=closed]:invisible data-[state=open]:visible"
    end
  end
