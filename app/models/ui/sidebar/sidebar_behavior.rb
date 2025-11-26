# frozen_string_literal: true

require "tailwind_merge"

module UI
  module Sidebar
    # SidebarBehavior
    #
    # Shared behavior for Sidebar component across ERB, ViewComponent, and Phlex implementations.
    # The Sidebar is the main container for sidebar content with variant and collapsible support.
    module SidebarBehavior
      def sidebar_html_attributes
        {
          class: sidebar_classes,
          data: sidebar_data_attributes
        }
      end

      def sidebar_classes
        classes_value = respond_to?(:classes, true) ? classes : @classes
        TailwindMerge::Merger.new.merge([
          sidebar_base_classes,
          sidebar_variant_classes,
          classes_value
        ].compact.join(" "))
      end

      def sidebar_data_attributes
        {
          slot: "sidebar",
          variant: @variant,
          side: @side,
          collapsible: @collapsible,
          ui__sidebar_target: "sidebar"
        }
      end

      private

      def sidebar_base_classes
        # Base classes for the sidebar container
        # Using group to allow child components to respond to sidebar state
        "group peer"
      end

      def sidebar_variant_classes
        case @variant.to_s
        when "floating"
          sidebar_floating_classes
        when "inset"
          sidebar_inset_classes
        else
          sidebar_default_classes
        end
      end

      def sidebar_default_classes
        # Default sidebar variant - fixed position with border
        # When expanded: full width
        # When collapsed + icon mode: icon width
        # When collapsed + offcanvas mode: width 0
        "hidden md:flex flex-col bg-sidebar text-sidebar-foreground " \
        "w-[var(--sidebar-width)] h-svh border-r border-sidebar-border " \
        "transition-[width] duration-[var(--duration-sidebar)] ease-[var(--ease-sidebar)] " \
        "group-data-[state=collapsed]:group-data-[collapsible=offcanvas]:w-0 " \
        "group-data-[state=collapsed]:group-data-[collapsible=offcanvas]:border-r-0 " \
        "group-data-[state=collapsed]:group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] " \
        "group-data-[side=right]:border-l group-data-[side=right]:border-r-0"
      end

      def sidebar_floating_classes
        # Floating variant - with margin, rounded corners, and shadow
        "hidden md:flex flex-col bg-sidebar text-sidebar-foreground " \
        "w-[var(--sidebar-width)] h-[calc(100svh-calc(var(--spacing)*4))] " \
        "m-2 rounded-lg border border-sidebar-border shadow " \
        "transition-[width] duration-[var(--duration-sidebar)] ease-[var(--ease-sidebar)] " \
        "group-data-[state=collapsed]:group-data-[collapsible=offcanvas]:w-0 " \
        "group-data-[state=collapsed]:group-data-[collapsible=offcanvas]:border-0 " \
        "group-data-[state=collapsed]:group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
      end

      def sidebar_inset_classes
        # Inset variant - appears inset within the layout
        "hidden md:flex flex-col bg-sidebar text-sidebar-foreground " \
        "w-[var(--sidebar-width)] h-svh " \
        "transition-[width] duration-[var(--duration-sidebar)] ease-[var(--ease-sidebar)] " \
        "group-data-[state=collapsed]:group-data-[collapsible=offcanvas]:w-0 " \
        "group-data-[state=collapsed]:group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
      end
    end
  end
end
