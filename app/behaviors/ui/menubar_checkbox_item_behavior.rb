# frozen_string_literal: true

# MenubarCheckboxItemBehavior
#
# Shared behavior for MenubarCheckboxItem component across ERB, ViewComponent, and Phlex implementations.
module UI::MenubarCheckboxItemBehavior
  # Returns HTML attributes for the checkbox item
  def menubar_checkbox_item_html_attributes
    attrs = {
      class: menubar_checkbox_item_classes,
      data: menubar_checkbox_item_data_attributes,
      role: "menuitemcheckbox",
      "aria-checked": checked?.to_s,
      tabindex: "-1"
    }

    # Add disabled attribute if specified
    attrs[:"data-disabled"] = "" if disabled?

    attrs
  end

  # Returns combined CSS classes for the checkbox item
  def menubar_checkbox_item_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes

    TailwindMerge::Merger.new.merge([
      "focus:bg-accent focus:text-accent-foreground",
      "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm",
      "outline-hidden select-none whitespace-nowrap",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for the checkbox item
  def menubar_checkbox_item_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    (attributes_value&.fetch(:data, {}) || {}).merge({
      "ui--menubar-target": "item",
      action: "click->ui--menubar#toggleCheckbox mouseenter->ui--menubar#trackHoveredItem",
      state: checked? ? "checked" : "unchecked"
    })
  end

  private

  def checked?
    defined?(@checked) && @checked
  end

  def disabled?
    defined?(@disabled) && @disabled
  end
end
