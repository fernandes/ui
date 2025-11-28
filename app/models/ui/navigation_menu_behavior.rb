# frozen_string_literal: true

    # NavigationMenuBehavior
    #
    # Shared behavior for NavigationMenu component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent styling and HTML attribute generation.
    module UI::NavigationMenuBehavior
      # Returns HTML attributes for the navigation menu container
      def navigation_menu_html_attributes
        attrs = {
          class: navigation_menu_classes,
          data: navigation_menu_data_attributes
        }
        attrs
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
