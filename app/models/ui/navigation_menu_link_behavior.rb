# frozen_string_literal: true

    # LinkBehavior
    #
    # Shared behavior for NavigationMenu Link component.
    # Supports asChild pattern for composition with link_to.
    module UI::NavigationMenuLinkBehavior
      # Returns HTML attributes for the link
      def navigation_menu_link_html_attributes
        active_value = defined?(@active) && @active

        attrs = {
          class: navigation_menu_link_classes,
          data: navigation_menu_link_data_attributes
        }

        # Add href if provided and not using asChild
        attrs[:href] = @href if defined?(@href) && @href

        # Add aria-current for active links
        attrs[:"aria-current"] = "page" if active_value

        attrs
      end

      # Returns combined CSS classes for the link
      def navigation_menu_link_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          # Base styles
          "flex flex-col gap-1 rounded-sm p-2 text-sm",
          # Interaction states
          "outline-hidden transition-colors select-none",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:bg-accent focus:text-accent-foreground",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50",
          # Icon styling
          "[&_svg:not([class*='text-'])]:text-muted-foreground",
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes
      def navigation_menu_link_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        active_value = defined?(@active) && @active

        base_data = {
          slot: "navigation-menu-link",
          active: active_value ? "true" : nil
        }.compact

        (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
      end

      # Returns CSS classes that mimic the trigger style (for direct links without dropdown)
      def navigation_menu_link_trigger_style_classes
        [
          "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center gap-1",
          "rounded-md bg-background px-4 py-2 text-sm font-medium",
          "outline-hidden transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:bg-accent focus:text-accent-foreground",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50"
        ].join(" ")
      end
    end
