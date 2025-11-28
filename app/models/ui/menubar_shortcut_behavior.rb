# frozen_string_literal: true

    # MenubarShortcutBehavior
    #
    # Shared behavior for MenubarShortcut component across ERB, ViewComponent, and Phlex implementations.
    module UI::MenubarShortcutBehavior
      # Returns HTML attributes for the shortcut
      def menubar_shortcut_html_attributes
        {
          class: menubar_shortcut_classes,
          data: menubar_shortcut_data_attributes
        }
      end

      # Returns combined CSS classes for the shortcut
      def menubar_shortcut_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          "text-muted-foreground ml-auto text-xs tracking-widest",
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for the shortcut
      def menubar_shortcut_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {})
      end
    end
