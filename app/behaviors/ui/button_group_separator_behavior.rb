# frozen_string_literal: true

# SeparatorBehavior
#
# Shared behavior for ButtonGroupSeparator component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation.
#
# Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
module UI::ButtonGroupSeparatorBehavior
  # Returns HTML attributes for the separator element
  def separator_html_attributes
    # Get Separator component attributes and merge with button group specific classes
    base_attrs = if defined?(super)
      super
    else
      {
        class: "",
        data: {
          slot: "button-group-separator",
          orientation: @orientation
        }
      }
    end

    # Merge button group specific classes
    base_attrs[:class] = TailwindMerge::Merger.new.merge([
      base_attrs[:class],
      "bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto"
    ].compact.join(" "))

    base_attrs
  end
end
