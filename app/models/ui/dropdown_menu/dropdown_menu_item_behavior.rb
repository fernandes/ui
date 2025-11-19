# frozen_string_literal: true

module UI
  module DropdownMenu
    # DropdownMenuItemBehavior
    #
    # Shared behavior for DropdownMenuItem component across ERB, ViewComponent, and Phlex implementations.
    module DropdownMenuItemBehavior
      # Returns HTML attributes for the menu item
      def dropdown_menu_item_html_attributes
        {
          class: dropdown_menu_item_classes,
          data: dropdown_menu_item_data_attributes,
          role: "menuitem",
          tabindex: "-1"
        }.tap do |attrs|
          attrs[:href] = @href if @href
        end
      end

      # Returns combined CSS classes for the menu item
      def dropdown_menu_item_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        base_classes = "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset=true]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

        TailwindMerge::Merger.new.merge([base_classes, classes_value].compact.join(" "))
      end

      # Returns data attributes for Stimulus target and actions
      def dropdown_menu_item_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        existing_action = (attributes_value&.fetch(:data, {}) || {}).fetch(:action, "")
        combined_action = [existing_action, "mouseenter->ui--dropdown#trackHoveredItem"].reject(&:empty?).join(" ")

        (attributes_value&.fetch(:data, {}) || {}).merge({
          "ui--dropdown-target": "item",
          action: combined_action,
          inset: @inset,
          variant: @variant
        })
      end
    end
  end
end
