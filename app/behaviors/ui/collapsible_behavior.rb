# frozen_string_literal: true

require "tailwind_merge"

# UI::CollapsibleBehavior
#
# @ui_component Collapsible
# @ui_category data-display
#
# @ui_anatomy Collapsible - Root container with state management (required)
# @ui_anatomy Content - Main content container (required)
# @ui_anatomy Trigger - Button or element that activates the component (required)
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Disabled state support
# @ui_feature Animation support
#
# @ui_aria_pattern Disclosure
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
#
# @ui_related accordion
#
module UI::CollapsibleBehavior
  def collapsible_html_attributes
    attrs = {
      data: collapsible_data_attributes
    }
    unless @as_child
      attrs[:class] = collapsible_classes
    end
    attrs
  end

  def collapsible_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      collapsible_base_classes,
      classes_value
    ].compact.join(" "))
  end

  def collapsible_data_attributes
    {
      controller: "ui--collapsible",
      slot: "collapsible",
      state: @open ? "open" : "closed",
      ui__collapsible_open_value: @open.to_s,
      ui__collapsible_disabled_value: @disabled.to_s
    }
  end

  private

  def collapsible_base_classes
    "group/collapsible"
  end
end
