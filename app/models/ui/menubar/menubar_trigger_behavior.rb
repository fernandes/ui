# frozen_string_literal: true

module UI
  module Menubar
    # MenubarTriggerBehavior
    #
    # Shared behavior for MenubarTrigger component across ERB, ViewComponent, and Phlex implementations.
    module MenubarTriggerBehavior
      # Returns HTML attributes for the trigger
      def menubar_trigger_html_attributes
        attrs = {
          class: menubar_trigger_classes,
          data: menubar_trigger_data_attributes,
          role: "menuitem",
          "aria-haspopup": "menu",
          "aria-expanded": "false",
          tabindex: first_trigger? ? "0" : "-1"
        }

        attrs
      end

      # Returns combined CSS classes for the trigger
      def menubar_trigger_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
          "focus:bg-accent focus:text-accent-foreground",
          "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for Stimulus
      def menubar_trigger_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {}).merge({
          "ui--menubar-target": "trigger",
          action: "click->ui--menubar#toggle mouseenter->ui--menubar#handleTriggerHover keydown->ui--menubar#handleTriggerKeydown",
          state: "closed"
        })
      end

      private

      # Check if this is the first trigger (should have tabindex=0)
      def first_trigger?
        defined?(@first) && @first
      end
    end
  end
end
