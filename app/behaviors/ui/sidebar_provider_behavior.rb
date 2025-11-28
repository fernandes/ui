# frozen_string_literal: true

require "tailwind_merge"

    # SidebarProviderBehavior
    #
    # Shared behavior for SidebarProvider component across ERB, ViewComponent, and Phlex implementations.
    # The SidebarProvider is the root container that manages sidebar state via Stimulus controller.
    module UI::SidebarProviderBehavior
      def sidebar_provider_html_attributes
        {
          class: sidebar_provider_classes,
          style: sidebar_provider_style,
          data: sidebar_provider_data_attributes
        }
      end

      def sidebar_provider_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_provider_base_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_provider_data_attributes
        # Only set collapsible attribute when collapsed (matches shadcn behavior)
        # This allows CSS selectors like group-has-[[data-collapsible=icon]] to work correctly
        attrs = {
          slot: "sidebar-provider",
          controller: "ui--sidebar",
          state: @open ? "expanded" : "collapsed",
          side: @side,
          ui__sidebar_open_value: @open.to_s,
          ui__sidebar_collapsible_value: @collapsible,
          ui__sidebar_side_value: @side,
          ui__sidebar_cookie_name_value: @cookie_name
        }
        attrs[:collapsible] = @collapsible unless @open
        attrs
      end

      def sidebar_provider_style
        [
          "--sidebar-width: #{@sidebar_width}",
          "--sidebar-width-mobile: #{@sidebar_width_mobile}",
          "--sidebar-width-icon: #{@sidebar_width_icon}"
        ].join("; ")
      end

      private

      def sidebar_provider_base_classes
        "group group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar"
      end
    end
