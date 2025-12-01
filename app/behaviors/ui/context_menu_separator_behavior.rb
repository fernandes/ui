# frozen_string_literal: true

# ContextMenuSeparatorBehavior
#
# Shared behavior for ContextMenuSeparator component across ERB, ViewComponent, and Phlex implementations.
module UI::ContextMenuSeparatorBehavior
  # Returns HTML attributes for the context menu separator
  def context_menu_separator_html_attributes
    {
      class: context_menu_separator_classes,
      role: "separator"
    }
  end

  # Returns combined CSS classes for the separator
  def context_menu_separator_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    base_classes = "bg-border -mx-1 my-1 h-px"

    TailwindMerge::Merger.new.merge([base_classes, classes_value].compact.join(" "))
  end
end
