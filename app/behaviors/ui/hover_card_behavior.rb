# frozen_string_literal: true

# UI::HoverCardBehavior
#
# @ui_component Hover Card
# @ui_description HoverCard - Phlex implementation
# @ui_category overlay
#
# @ui_anatomy Hover Card - Container for hover card trigger and content. (required)
# @ui_anatomy Content - The content that appears on hover. (required)
# @ui_anatomy Trigger - Element that triggers the hover card on hover. (required)
#
# @ui_feature Custom styling with Tailwind classes
#
# @ui_aria_pattern Tooltip
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
#
# @ui_related popover
# @ui_related tooltip
#
module UI::HoverCardBehavior
  # Returns HTML attributes for the hover card container element
  def hover_card_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: hover_card_classes,
      data: hover_card_data_attributes
    }.merge(attributes_value)
  end

  # Returns combined CSS classes for the hover card
  def hover_card_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for the hover card controller
  def hover_card_data_attributes
    {
      controller: "ui--hover-card"
    }
  end
end
