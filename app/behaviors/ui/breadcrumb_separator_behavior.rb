# frozen_string_literal: true

# BreadcrumbSeparatorBehavior
#
# Shared behavior for Breadcrumb Separator component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation for breadcrumb separators.
module UI::BreadcrumbSeparatorBehavior
  # Returns HTML attributes for the breadcrumb separator element
  def breadcrumb_separator_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: breadcrumb_separator_classes,
      role: "presentation",
      "aria-hidden": "true"
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes for the breadcrumb separator
  def breadcrumb_separator_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      breadcrumb_separator_base_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes applied to breadcrumb separator
  def breadcrumb_separator_base_classes
    "[&>svg]:size-3.5"
  end
end
