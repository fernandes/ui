# frozen_string_literal: true

module UI
  module DropdownMenu
    # DropdownMenuSubContentBehavior
    #
    # Shared behavior for DropdownMenuSubContent component across ERB, ViewComponent, and Phlex implementations.
    module DropdownMenuSubContentBehavior
      # Returns HTML attributes for the sub content
      def dropdown_menu_sub_content_html_attributes
        {
          class: dropdown_menu_sub_content_classes,
          data: dropdown_menu_sub_content_data_attributes,
          role: "menu",
          tabindex: "-1"
        }
      end

      # Returns combined CSS classes for the sub content
      def dropdown_menu_sub_content_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        base_classes = "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[11rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg absolute"

        TailwindMerge::Merger.new.merge([
          "hidden absolute",
          base_classes,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes for Stimulus
      def dropdown_menu_sub_content_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        (attributes_value&.fetch(:data, {}) || {}).merge({
          state: "closed",
          side: @side || "right",
          align: @align || "start"
        })
      end
    end
  end
end
