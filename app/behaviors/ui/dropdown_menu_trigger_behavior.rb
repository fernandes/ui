# frozen_string_literal: true

# DropdownMenuTriggerBehavior
#
# Shared behavior for DropdownMenuTrigger component across ERB, ViewComponent, and Phlex implementations.
module UI::DropdownMenuTriggerBehavior
  # Returns HTML attributes for the trigger
  # When as_child is true, only data attributes are returned to avoid overriding child's classes
  def dropdown_menu_trigger_html_attributes
    attrs = {
      data: dropdown_menu_trigger_data_attributes,
      tabindex: "0",
      role: "button",
      "aria-haspopup": "menu",
      "aria-expanded": "false"
    }

    # Only include class if it's not empty (to avoid overriding child component's classes)
    trigger_classes = dropdown_menu_trigger_classes
    attrs[:class] = trigger_classes unless trigger_classes.blank?

    attrs
  end

  # Attributes for the default (non as_child) trigger, given its rendered content.
  #
  # - Text/icon content: the trigger is a native <button type="button">, so it
  #   is one tab stop with button semantics and no role/tabindex needed.
  # - Content that is itself interactive (a <button>, a link, ...): the
  #   wrapper is a plain <div> with no role, tabindex or ARIA, so there is no
  #   nested interactive element and no second tab stop. The controller moves
  #   aria-haspopup / aria-expanded / aria-controls onto that inner element.
  def dropdown_menu_trigger_default_attributes(content_html)
    attrs = dropdown_menu_trigger_html_attributes.except(:role, :tabindex)
    if dropdown_menu_trigger_interactive_content?(content_html)
      attrs.except(:"aria-haspopup", :"aria-expanded")
    else
      attrs.merge(type: "button")
    end
  end

  # Whether the trigger's content contains its own interactive element.
  def dropdown_menu_trigger_interactive_content?(content_html)
    content_html.to_s.match?(/<(button|a|input|select|textarea)[\s>]|role=["']button["']/i)
  end

  # Tag for the default trigger, given its rendered content.
  def dropdown_menu_trigger_tag(content_html)
    dropdown_menu_trigger_interactive_content?(content_html) ? :div : :button
  end

  # Returns combined CSS classes for the trigger
  def dropdown_menu_trigger_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    UI::ClassMerger.merge([
      dropdown_menu_trigger_base_classes,
      classes_value
    ].compact.join(" "))
  end

  # Base classes for trigger (focus styles)
  def dropdown_menu_trigger_base_classes
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
  end

  # Returns data attributes for Stimulus
  def dropdown_menu_trigger_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    (attributes_value&.fetch(:data, {}) || {}).merge({
      "ui--dropdown-target": "trigger",
      action: "click->ui--dropdown#toggle keydown->ui--dropdown#handleTriggerKeydown"
    })
  end
end
