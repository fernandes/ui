# frozen_string_literal: true

# ViewportBehavior
#
# Shared behavior for NavigationMenu Viewport component.
module UI::NavigationMenuViewportBehavior
  # Returns HTML attributes for the viewport wrapper
  def navigation_menu_viewport_wrapper_html_attributes
    {
      class: navigation_menu_viewport_wrapper_classes,
      data: {slot: "navigation-menu-viewport-wrapper"}
    }
  end

  # Returns CSS classes for the viewport wrapper
  def navigation_menu_viewport_wrapper_classes
    "absolute left-0 top-full flex justify-center perspective-[2000px]"
  end

  # Returns HTML attributes for the viewport
  def navigation_menu_viewport_html_attributes
    {
      class: navigation_menu_viewport_classes,
      data: navigation_menu_viewport_data_attributes
    }
  end

  # Returns combined CSS classes for the viewport
  def navigation_menu_viewport_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      # Base styles
      "origin-top-center bg-popover text-popover-foreground",
      "relative mt-1.5 overflow-hidden rounded-md border shadow",
      # Dynamic sizing via CSS variables
      "h-[var(--ui-navigation-menu-viewport-height)]",
      "w-full md:w-[var(--ui-navigation-menu-viewport-width)]",
      # State visibility
      "data-[state=closed]:invisible data-[state=open]:visible",
      "data-[state=closed]:pointer-events-none data-[state=open]:pointer-events-auto",
      # Animation
      "transition-[width,height] duration-200",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out data-[state=open]:fade-in",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes
  def navigation_menu_viewport_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    base_data = {
      slot: "navigation-menu-viewport",
      state: "closed",
      "ui--navigation-menu-target": "viewport"
    }
    (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
  end
end
