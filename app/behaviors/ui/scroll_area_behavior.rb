# frozen_string_literal: true

# UI::ScrollAreaBehavior
#
# @ui_component Scroll Area
# @ui_description ScrollArea - Phlex implementation
# @ui_category layout
#
# @ui_anatomy Scroll Area - Augments native scroll functionality for custom, cross-browser styling. (required)
# @ui_anatomy Viewport - Scrollable content container with hidden native scrollbar.
#
# @ui_feature Custom styling with Tailwind classes
#
# @ui_aria_pattern Scrollable Region
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/
#
# @ui_keyboard Enter Activates the focused element
# @ui_keyboard End Moves focus to last item
#
# @ui_related carousel
#
module UI::ScrollAreaBehavior
  # Returns HTML attributes for the scroll area root element
  def scroll_area_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: scroll_area_classes,
      dir: "ltr",
      style: "position: relative; --ui-scroll-area-corner-width: 0px; --ui-scroll-area-corner-height: 0px;",
      data: {
        slot: "scroll-area"
      }
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes
  def scroll_area_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      scroll_area_base_classes,
      classes_value
    ].compact.join(" "))
  end

  private

  # Base classes for scroll area root
  def scroll_area_base_classes
    "relative"
  end
end
