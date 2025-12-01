# frozen_string_literal: true

require "tailwind_merge"

# ContentBehavior
#
# Shared behavior for CollapsibleContent component across ERB, ViewComponent, and Phlex implementations.
module UI::CollapsibleContentBehavior
  def collapsible_content_html_attributes
    attrs = {
      class: collapsible_content_classes,
      data: collapsible_content_data_attributes
    }
    attrs[:hidden] = true unless @force_mount
    attrs
  end

  def collapsible_content_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      collapsible_content_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def collapsible_content_data_attributes
    {
      slot: "collapsible-content",
      state: "closed",
      ui__collapsible_target: "content"
    }
  end

  private

  def collapsible_content_base_classes
    "overflow-hidden transition-[height] duration-[var(--duration-collapsible)] ease-[var(--ease-collapsible)] data-[state=closed]:h-0"
  end
end
