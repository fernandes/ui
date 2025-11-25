# frozen_string_literal: true

module UI
  module Menubar
    # MenubarSubTriggerBehavior
    #
    # Shared behavior for MenubarSubTrigger component across ERB, ViewComponent, and Phlex implementations.
    module MenubarSubTriggerBehavior
      # Returns HTML attributes for the sub trigger
      def menubar_sub_trigger_html_attributes
        attrs = {
          class: menubar_sub_trigger_classes,
          data: menubar_sub_trigger_data_attributes,
          role: "menuitem",
          tabindex: "-1"
        }

        # Add disabled attribute if specified
        attrs[:"data-disabled"] = "" if disabled?

        attrs
      end

      # Returns combined CSS classes for the sub trigger
      def menubar_sub_trigger_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        inset_class = inset? ? "pl-8" : ""

        TailwindMerge::Merger.new.merge([
          "focus:bg-accent focus:text-accent-foreground",
          "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm",
          "outline-hidden select-none whitespace-nowrap",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          inset_class,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for the sub trigger
      def menubar_sub_trigger_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {}).merge({
          "ui--menubar-target": "item",
          action: "mouseenter->ui--menubar#openSubmenu mouseleave->ui--menubar#closeSubmenu",
          state: "closed"
        })
      end

      private

      def inset?
        defined?(@inset) && @inset
      end

      def disabled?
        defined?(@disabled) && @disabled
      end
    end
  end
end
