# frozen_string_literal: true

# UI::InputGroupAddonBehavior
#
# Shared behavior for InputGroupAddon component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent styling and HTML attribute generation for input group addons.
module UI::InputGroupAddonBehavior
  # Returns HTML attributes for the addon element
  def input_group_addon_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      role: "group",
      "data-slot": "input-group-addon",
      "data-align": @align,
      class: input_group_addon_classes
    }.merge(attributes_value).compact
  end

  # Returns combined CSS classes for the addon
  def input_group_addon_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      input_group_addon_base_classes,
      input_group_addon_align_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes - exact match from shadcn/ui
  def input_group_addon_base_classes
    "text-muted-foreground flex h-auto cursor-text items-center gap-2 py-1.5 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)] group-data-[disabled=true]/input-group:opacity-50"
  end

  # Alignment-specific classes
  def input_group_addon_align_classes
    case @align.to_s
    when "inline-start"
      "order-first justify-center pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]"
    when "inline-end"
      "order-last justify-center pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]"
    when "block-start"
      "order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5"
    when "block-end"
      "order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5"
    else
      "order-first justify-center pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]"
    end
  end
end
