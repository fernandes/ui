# frozen_string_literal: true

# UI::SelectGroupBehavior
#
# Shared behavior for Select options group across ERB, ViewComponent, and Phlex implementations.
# This module provides consistent HTML attribute generation and styling.
module UI::SelectGroupBehavior
    # Returns HTML attributes for the select group element
    def select_group_html_attributes
      attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
      {
        class: select_group_classes,
        role: "group",
        data: {
          slot: "select-group" # ADDED: data-slot attribute
        }
      }.merge(attributes_value || {})
    end

    # Returns combined CSS classes
    def select_group_classes
      classes_value = respond_to?(:classes, true) ? classes : @classes
      TailwindMerge::Merger.new.merge([
        select_group_base_classes,
        classes_value
      ].compact.join(" "))
    end

    private

    # Base classes for select group
    def select_group_base_classes
      "w-full"
    end
  end
