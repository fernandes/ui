# frozen_string_literal: true

module UI
  module Menubar
    # MenubarItemBehavior
    #
    # Shared behavior for MenubarItem component across ERB, ViewComponent, and Phlex implementations.
    module MenubarItemBehavior
      # Returns HTML attributes for the menu item
      def menubar_item_html_attributes
        attrs = {
          class: menubar_item_classes,
          data: menubar_item_data_attributes,
          role: "menuitem",
          tabindex: "-1"
        }

        # Add disabled attribute if specified
        attrs[:"data-disabled"] = "" if disabled?

        attrs
      end

      # Returns combined CSS classes for the item
      def menubar_item_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        variant_classes = variant_class
        inset_class = inset? ? "pl-8" : ""

        TailwindMerge::Merger.new.merge([
          "focus:bg-accent focus:text-accent-foreground",
          "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
          "outline-hidden select-none whitespace-nowrap",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          variant_classes,
          inset_class,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for the item
      def menubar_item_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        base_data = {
          "ui--menubar-target": "item",
          action: "click->ui--menubar#selectItem mouseenter->ui--menubar#trackHoveredItem"
        }

        # Add variant if destructive
        base_data[:variant] = "destructive" if destructive?

        (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
      end

      private

      def variant_class
        return "" unless destructive?

        [
          "data-[variant=destructive]:text-destructive",
          "data-[variant=destructive]:focus:bg-destructive/10",
          "dark:data-[variant=destructive]:focus:bg-destructive/20",
          "data-[variant=destructive]:focus:text-destructive"
        ].join(" ")
      end

      def destructive?
        defined?(@variant) && @variant == :destructive
      end

      def inset?
        defined?(@inset) && @inset
      end

      def disabled?
        defined?(@disabled) && @disabled
      end
    end
  end
end
