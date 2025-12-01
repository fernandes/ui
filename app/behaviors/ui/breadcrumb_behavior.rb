# frozen_string_literal: true

# UI::BreadcrumbBehavior
#
# @ui_component Breadcrumb
# @ui_description Breadcrumb - Phlex implementation
# @ui_category navigation
#
# @ui_anatomy Breadcrumb - A navigation breadcrumb component for displaying hierarchical navigation. (required)
# @ui_anatomy Ellipsis - Indicator for collapsed/hidden breadcrumb items.
# @ui_anatomy Item - Individual breadcrumb entry within the breadcrumb list.
# @ui_anatomy Link - Clickable breadcrumb link for navigation.
# @ui_anatomy List - Container for breadcrumb items, rendered as an ordered list.
# @ui_anatomy Page - Current page indicator (non-clickable) for breadcrumbs.
# @ui_anatomy Separator - Visual divider between breadcrumb items with default chevron icon.
#
# @ui_feature ARIA attributes for accessibility
#
# @ui_aria_pattern Breadcrumb
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
# @ui_aria_attr aria-label
#
module UI::BreadcrumbBehavior
  # Returns HTML attributes for the breadcrumb container element
  def breadcrumb_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: breadcrumb_classes,
      "aria-label": "breadcrumb"
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes for the breadcrumb container
  def breadcrumb_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    classes_value || ""
  end
end
