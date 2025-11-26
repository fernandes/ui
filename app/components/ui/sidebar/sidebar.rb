# frozen_string_literal: true

module UI
  module Sidebar
    # Sidebar - Phlex implementation
    #
    # Main sidebar container with support for variants and collapsible modes.
    # Must be used within a SidebarProvider.
    #
    # Automatically renders a mobile Sheet version (hidden on md+) alongside
    # the desktop sidebar (hidden below md), eliminating content duplication.
    #
    # @example Basic usage
    #   render UI::Sidebar::Sidebar.new do
    #     render UI::Sidebar::Header.new { "Header" }
    #     render UI::Sidebar::Content.new { "Content" }
    #     render UI::Sidebar::Footer.new { "Footer" }
    #   end
    #
    # @example With variant
    #   render UI::Sidebar::Sidebar.new(variant: "floating") do
    #     # ...
    #   end
    class Sidebar < Phlex::HTML
      include UI::Sidebar::SidebarBehavior

      # @param variant [String] Visual variant: "sidebar" (default), "floating", or "inset"
      # @param side [String] Side position: "left" or "right" (default: "left")
      # @param collapsible [String] Collapsible mode: "offcanvas", "icon", or "none" (default: "icon")
      # @param classes [String] Additional CSS classes
      # @param attributes [Hash] Additional HTML attributes
      def initialize(
        variant: "sidebar",
        side: "left",
        collapsible: "icon",
        classes: "",
        **attributes
      )
        @variant = variant
        @side = side
        @collapsible = collapsible
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        # Render mobile Sheet version (visible only below md breakpoint)
        render_mobile_sheet(&block)

        # Render desktop sidebar (visible only at md+ breakpoint)
        render_desktop_sidebar(&block)
      end

      private

      def render_mobile_sheet(&block)
        # Mobile Sheet - slides in from left/right based on side
        sheet_side = @side.to_s == "right" ? "right" : "left"

        render UI::Sheet::Sheet.new(
          classes: "md:hidden",
          data: { ui__sidebar_target: "mobileSheet" }
        ) do
          render UI::Sheet::Overlay.new
          render UI::Sheet::Content.new(
            side: sheet_side,
            show_close: false,
            classes: "bg-sidebar text-sidebar-foreground w-[var(--sidebar-width-mobile)] p-0"
          ) do
            # Screen reader only header for accessibility
            render UI::Sheet::Header.new(classes: "sr-only") do
              render UI::Sheet::Title.new { "Sidebar" }
              render UI::Sheet::Description.new { "Navigation sidebar" }
            end

            # Same content as desktop sidebar
            div(class: "flex h-full w-full flex-col", &block)
          end
        end
      end

      def render_desktop_sidebar(&block)
        all_attributes = sidebar_html_attributes

        # Merge classes with TailwindMerge
        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        # Deep merge other attributes (excluding class)
        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        aside(**all_attributes) do
          # Inner container with flex layout
          div(class: "flex h-full w-full flex-col", &block)
        end
      end
    end
  end
end
