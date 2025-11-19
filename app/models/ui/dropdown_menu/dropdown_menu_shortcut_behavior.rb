# frozen_string_literal: true

module UI
  module DropdownMenu
    # DropdownMenuShortcutBehavior
    #
    # Shared behavior for DropdownMenuShortcut component across ERB, ViewComponent, and Phlex implementations.
    module DropdownMenuShortcutBehavior
      # Returns HTML attributes for the shortcut
      def dropdown_menu_shortcut_html_attributes
        {
          class: dropdown_menu_shortcut_classes
        }
      end

      # Returns combined CSS classes for the shortcut
      def dropdown_menu_shortcut_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        base_classes = "text-muted-foreground ml-auto text-xs tracking-widest"

        TailwindMerge::Merger.new.merge([base_classes, classes_value].compact.join(" "))
      end
    end
  end
end
