# frozen_string_literal: true

# BreadcrumbListBehavior
#
# Shared behavior for Breadcrumb List component across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation for the breadcrumb list container.
module UI::BreadcrumbListBehavior
  # Returns HTML attributes for the breadcrumb list element
  def breadcrumb_list_html_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    {
      class: breadcrumb_list_classes
    }.merge(attributes_value || {})
  end

  # Returns combined CSS classes for the breadcrumb list
  def breadcrumb_list_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      breadcrumb_list_base_classes,
      classes_value

    ].compact.join(" "))
  end

  private

  # Base classes applied to breadcrumb list
  def breadcrumb_list_base_classes
    "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5"
  end
end
