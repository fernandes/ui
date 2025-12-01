# frozen_string_literal: true

# UI::NavigationMenuBehavior
#
# @ui_component Navigation Menu
# @ui_description NavigationMenu - Phlex implementation
# @ui_category navigation
#
# @ui_anatomy Navigation Menu - A collection of links for navigating websites. Built on Radix UI patterns. (required)
# @ui_anatomy Content - Container for navigation menu content that appears when trigger is activated. (required)
# @ui_anatomy Item - Wrapper for individual navigation menu item.
# @ui_anatomy Link - Navigation link component. Supports asChild pattern for composition with link_to.
# @ui_anatomy List - Container for navigation menu items.
# @ui_anatomy Trigger - Button that toggles the navigation menu content. (required)
# @ui_anatomy Viewport - Container for navigation menu content when viewport mode is enabled.
#
# @ui_feature Custom styling with Tailwind classes
# @ui_feature Keyboard navigation with arrow keys
# @ui_feature Click outside to close
# @ui_feature Animation support
#
# @ui_aria_pattern Navigation
# @ui_aria_reference https://www.w3.org/WAI/ARIA/apg/patterns/navigation/
#
# @ui_keyboard Enter Activates the focused element
# @ui_keyboard Escape Closes the component
# @ui_keyboard ArrowDown Moves focus to next item
# @ui_keyboard ArrowLeft Moves focus left or decreases value
# @ui_keyboard ArrowRight Moves focus right or increases value
# @ui_keyboard Home Moves focus to first item
# @ui_keyboard End Moves focus to last item
# @ui_keyboard Tab Moves focus to next focusable element
#
# @ui_related menubar
# @ui_related tabs
#
module UI::NavigationMenuBehavior
  # Returns HTML attributes for the navigation menu container
  def navigation_menu_html_attributes
    {
      class: navigation_menu_classes,
      data: navigation_menu_data_attributes
    }
  end

  # Returns combined CSS classes for the navigation menu
  def navigation_menu_classes
    classes_value = respond_to?(:classes, true) ? classes : @classes
    TailwindMerge::Merger.new.merge([
      "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
      classes_value
    ].compact.join(" "))
  end

  # Returns data attributes for Stimulus controller
  def navigation_menu_data_attributes
    attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
    viewport_value = defined?(@viewport) ? @viewport : true
    delay_value = defined?(@delay_duration) ? @delay_duration : 200
    skip_delay_value = defined?(@skip_delay_duration) ? @skip_delay_duration : 300

    base_data = {
      controller: "ui--navigation-menu",
      "ui--navigation-menu-viewport-value": viewport_value,
      "ui--navigation-menu-delay-duration-value": delay_value,
      "ui--navigation-menu-skip-delay-duration-value": skip_delay_value
    }

    (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
  end
end
