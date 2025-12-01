# frozen_string_literal: true

# MenubarSeparatorBehavior
#
# Shared behavior for MenubarSeparator component across ERB, ViewComponent, and Phlex implementations.
module UI::MenubarSeparatorBehavior
  # Returns HTML attributes for the separator
  def menubar_separator_html_attributes
    {
      class: menubar_separator_classes,
      data: menubar_separator_data_attributes,
      role: "separator"
    }
  end

  # Returns combined CSS classes for the separator
  def menubar_separator_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      "bg-border -mx-1 my-1 h-px",
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for the separator
  def menubar_separator_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    attributes_value&.fetch(:data, {}) || {}
  end
end
