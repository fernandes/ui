# frozen_string_literal: true

    # ContentBehavior
    #
    # Shared behavior for NavigationMenu Content component.
    module UI::NavigationMenuContentBehavior
      # Returns HTML attributes for the content
      def navigation_menu_content_html_attributes
        attrs = {
          class: navigation_menu_content_classes,
          data: navigation_menu_content_data_attributes
        }
        attrs
      end

      # Returns combined CSS classes for the content
      def navigation_menu_content_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        viewport_mode = defined?(@viewport) ? @viewport : true

        base_classes = if viewport_mode
          # Viewport mode - content appears inside viewport
          [
            "absolute left-0 top-0 w-full p-2 md:w-auto",
            # Animation classes
            "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
            "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
            "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
            "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52"
          ]
        else
          # Non-viewport mode - content appears directly under trigger
          [
            "absolute left-0 top-full z-50 mt-1.5 w-max p-2",
            "rounded-md border bg-popover text-popover-foreground shadow",
            # Visibility controlled by data-state (JS sets this AFTER animation completes for closing)
            "data-[state=closed]:invisible data-[state=open]:visible",
            "data-[state=closed]:pointer-events-none data-[state=open]:pointer-events-auto",
            # Animation classes - use motion for directional animations
            # fill-mode-forwards keeps the final animation state (prevents flash back to original position)
            "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out fill-mode-forwards",
            "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
            "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52",
            "data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52"
          ]
        end

        TailwindMerge::Merger.new.merge([
          *base_classes,
          classes_value
        ].compact.join(" "))
      end

      # Returns data attributes
      def navigation_menu_content_data_attributes
        attributes_value = respond_to?(:attributes, true) ? attributes : @attributes
        base_data = {
          slot: "navigation-menu-content",
          state: "closed",
          "ui--navigation-menu-target": "content",
          action: "mouseleave->ui--navigation-menu#handleContentLeave"
        }
        (attributes_value&.fetch(:data, {}) || {}).merge(base_data)
      end
    end
