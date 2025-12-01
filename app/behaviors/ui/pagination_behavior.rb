# frozen_string_literal: true

# UI::PaginationBehavior
#
# @ui_component Pagination
# @ui_category navigation
#
# @ui_anatomy Pagination - Root container for pagination (required)
# @ui_anatomy Content - Main content container (required)
# @ui_anatomy Ellipsis - Indicator for truncated items
# @ui_anatomy Item - Individual item element
# @ui_anatomy Link - Clickable navigation link
# @ui_anatomy Next - Navigate to next item
# @ui_anatomy Previous - Navigate to previous item
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature ARIA attributes for accessibility
#
module UI::PaginationBehavior
  # Base CSS classes for pagination container
  def pagination_base_classes
    "mx-auto flex w-full justify-center"
  end

  # Merge base classes with custom classes using TailwindMerge
  def pagination_classes
    TailwindMerge::Merger.new.merge([pagination_base_classes, @classes].compact.join(" "))
  end

  # Build complete HTML attributes hash for pagination container
  def pagination_html_attributes
    base_attrs = @attributes&.except(:data) || {}
    base_attrs.merge(
      role: "navigation",
      "aria-label": "pagination",
      "data-slot": "pagination",
      class: pagination_classes
    )
  end
end
