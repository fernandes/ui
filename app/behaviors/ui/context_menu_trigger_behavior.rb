# frozen_string_literal: true

    # ContextMenuTriggerBehavior
    #
    # Shared behavior for ContextMenuTrigger component across ERB, ViewComponent, and Phlex implementations.
    module UI::ContextMenuTriggerBehavior
      # Returns HTML attributes for the context menu trigger
      def context_menu_trigger_html_attributes
        {
          class: context_menu_trigger_classes,
          data: context_menu_trigger_data_attributes
        }
      end

      # Returns combined CSS classes for the trigger
      def context_menu_trigger_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          "flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm",
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for Stimulus action
      def context_menu_trigger_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {}).merge({
          action: "contextmenu->ui--context-menu#open",
          "ui--context-menu-target": "trigger"
        })
      end
    end
