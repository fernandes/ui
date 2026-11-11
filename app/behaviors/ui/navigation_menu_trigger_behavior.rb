# frozen_string_literal: true

# TriggerBehavior
#
# Shared behavior for NavigationMenu Trigger component.
module UI::NavigationMenuTriggerBehavior
  # Returns HTML attributes for the trigger
  #
  # Every trigger is a Tab stop: a navigation menu is a list of links, not a
  # composite widget (Base UI NavigationMenuTrigger). The legacy `first:`
  # option is still accepted and ignored. aria-controls is wired by the
  # controller (per-instance ids).
  def navigation_menu_trigger_html_attributes
    {
      class: navigation_menu_trigger_classes,
      data: navigation_menu_trigger_data_attributes,
      type: "button",
      "aria-expanded": "false"
    }
  end

  # Returns combined CSS classes for the trigger
  def navigation_menu_trigger_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    UI::ClassMerger.merge([
      # Base styles
      "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center gap-1",
      "rounded-md bg-background px-4 py-2 text-sm font-medium",
      # Focus and hover states
      "outline-hidden transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus:bg-accent focus:text-accent-foreground",
      "focus-visible:ring-[3px] focus-visible:ring-ring/50",
      # Disabled state
      "disabled:pointer-events-none disabled:opacity-50",
      # Open state
      "data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground",
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes
  def navigation_menu_trigger_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    base_data = {
      slot: "navigation-menu-trigger",
      state: "closed",
      "ui--navigation-menu-target": "trigger",
      action: "click->ui--navigation-menu#toggle mouseenter->ui--navigation-menu#handleTriggerHover mouseleave->ui--navigation-menu#handleTriggerLeave"
    }
    (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
  end

  # Returns CSS classes for the chevron icon
  def navigation_menu_trigger_chevron_classes
    "size-3 shrink-0 transition-transform duration-200 group-data-[state=open]/navigation-menu-trigger:rotate-180"
  end
end
