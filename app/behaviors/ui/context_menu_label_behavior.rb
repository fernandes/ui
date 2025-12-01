# frozen_string_literal: true

# ContextMenuLabelBehavior
#
# Shared behavior for ContextMenuLabel component across ERB, ViewComponent, and Phlex implementations.
module UI::ContextMenuLabelBehavior
  # Returns HTML attributes for the context menu label
  def context_menu_label_html_attributes
    {
      class: context_menu_label_classes,
      data: context_menu_label_data_attributes
    }
  end

  # Returns combined CSS classes for the label
  def context_menu_label_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    base_classes = "text-foreground px-2 py-1.5 text-sm font-medium"

    TailwindMerge::Merger.new.merge([
      base_classes,
      @inset ? "pl-8" : nil,
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for the label
  def context_menu_label_data_attributes
    {
      inset: @inset
    }
  end
end
