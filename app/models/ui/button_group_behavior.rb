# frozen_string_literal: true

    # ButtonGroupBehavior
    #
    # Shared behavior for ButtonGroup component across ERB, ViewComponent, and Phlex implementations.
    # This module provides consistent styling and HTML attribute generation.
    #
    # Based on shadcn/ui ButtonGroup: https://ui.shadcn.com/docs/components/button-group
    module UI::ButtonGroupBehavior
      # Returns HTML attributes for the button group container
      def button_group_html_attributes
        {
          role: "group",
          data: {
            slot: "button-group",
            orientation: @orientation
          },
          class: button_group_classes
        }
      end

      # Returns combined CSS classes for the button group
      def button_group_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          button_group_base_classes,
          button_group_orientation_classes,
          classes_value
        ].compact.join(" "))
      end

      private

      # Base classes applied to all button groups
      # Matches shadcn/ui v4 exactly
      def button_group_base_classes
        "flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative " \
        "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 " \
        "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md " \
        "has-[>[data-slot=button-group]]:gap-2"
      end

      # Orientation-specific classes based on @orientation
      # Matches shadcn/ui v4 exactly
      # Note: We exclude [role=menu] elements from border-radius rules (dropdown content)
      def button_group_orientation_classes
        case @orientation.to_s
        when "vertical"
          "flex-col [&>*:not(:first-child):not([role=menu])]:rounded-t-none [&>*:not(:first-child):not([role=menu])]:border-t-0 [&>*:not(:last-child):not([role=menu])]:rounded-b-none"
        else # horizontal (default)
          "[&>*:not(:first-child):not([role=menu])]:rounded-l-none [&>*:not(:first-child):not([role=menu])]:border-l-0 " \
          "[&>*:not(:last-child):not(:has(+[role=menu])):not([role=menu])]:rounded-r-none"
        end
      end
    end
