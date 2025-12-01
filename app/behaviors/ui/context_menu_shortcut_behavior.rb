# frozen_string_literal: true

# ContextMenuShortcutBehavior
#
# Shared behavior for ContextMenuShortcut component across ERB, ViewComponent, and Phlex implementations.
module UI::ContextMenuShortcutBehavior
  # Returns HTML attributes for the context menu shortcut
  def context_menu_shortcut_html_attributes
    {
      class: context_menu_shortcut_classes
    }
  end

  # Returns combined CSS classes for the shortcut
  def context_menu_shortcut_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    base_classes = "text-muted-foreground ml-auto text-xs tracking-widest"

    TailwindMerge::Merger.new.merge([base_classes, classes_value].compact.join(" "))
  end
end
