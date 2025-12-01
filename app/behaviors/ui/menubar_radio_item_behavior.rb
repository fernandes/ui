# frozen_string_literal: true

# MenubarRadioItemBehavior
#
# Shared behavior for MenubarRadioItem component across ERB, ViewComponent, and Phlex implementations.
module UI::MenubarRadioItemBehavior
  # Returns HTML attributes for the radio item
  def menubar_radio_item_html_attributes
    attrs = {
      class: menubar_radio_item_classes,
      data: menubar_radio_item_data_attributes,
      role: "menuitemradio",
      "aria-checked": checked?.to_s,
      tabindex: "-1"
    }

    # Add disabled attribute if specified
    attrs[:"data-disabled"] = "" if disabled?

    attrs
  end

  # Returns combined CSS classes for the radio item
  def menubar_radio_item_classes
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

  # Returns data attributes for the radio item
  def menubar_radio_item_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    base_data = {
      "ui--menubar-target": "item",
      action: "click->ui--menubar#selectRadio mouseenter->ui--menubar#trackHoveredItem",
      state: checked? ? "checked" : "unchecked"
    }

    # Store the value for this radio item
    base_data[:"ui--menubar-radio-item-value"] = @value if defined?(@value) && @value

    (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
  end

  private

  def checked?
    defined?(@checked) && @checked
  end

  def disabled?
    defined?(@disabled) && @disabled
  end
end
