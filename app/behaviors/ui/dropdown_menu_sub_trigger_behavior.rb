# frozen_string_literal: true

# DropdownMenuSubTriggerBehavior
#
# Shared behavior for DropdownMenuSubTrigger component across ERB, ViewComponent, and Phlex implementations.
module UI::DropdownMenuSubTriggerBehavior
  # Returns HTML attributes for the submenu trigger
  def dropdown_menu_sub_trigger_html_attributes
    {
      class: dropdown_menu_sub_trigger_classes,
      data: dropdown_menu_sub_trigger_data_attributes,
      role: "menuitem",
      tabindex: "-1"
    }
  end

  # Returns combined CSS classes for the submenu trigger
  def dropdown_menu_sub_trigger_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    base_classes = "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-[state=open]:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset=true]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

    TailwindMerge::Merger.new.merge([base_classes, classes_value].compact.join(" "))
  end

  # Returns data attributes for Stimulus
  def dropdown_menu_sub_trigger_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    (attributes_value&.fetch(:data, {}) || {}).merge({
      "ui--dropdown-target": "item",
      action: "mouseenter->ui--dropdown#openSubmenu mouseleave->ui--dropdown#closeSubmenu",
      inset: @inset,
      state: "closed"
    })
  end
end
