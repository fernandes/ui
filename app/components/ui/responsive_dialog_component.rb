# frozen_string_literal: true

    # ResponsiveDialog component (ViewComponent)
    # Combines Dialog (desktop) and Drawer (mobile) with responsive switching
    #
    # Hybrid CSS + Stimulus approach:
    # - Renders both Dialog and Drawer
    # - CSS hides one based on breakpoint (md:hidden / md:block)
    # - Stimulus controller syncs state between them
    #
    # @example Basic usage
    #   <%= render UI::ResponsiveDialogComponent.new do %>
    #     <!-- Content will be rendered in both Dialog and Drawer -->
    #     <form>...</form>
    #   <% end %>
    #
    # @example With custom breakpoint
    #   <%= render UI::ResponsiveDialogComponent.new(
    #     breakpoint: 1024,
    #     direction: "right"
    #   ) do %>
    #     <!-- Content -->
    #   <% end %>
    class UI::ResponsiveDialogComponent < ViewComponent::Base
      include UI::ResponsiveDialogBehavior

      # @param open [Boolean] whether the dialog/drawer is open
      # @param breakpoint [Integer] responsive breakpoint in pixels (default: 768 = md)
      # @param direction [String] drawer direction: "bottom", "top", "left", "right"
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(
        open: false,
        breakpoint: 768,
        direction: "bottom",
        classes: "",
        attributes: {}
      )
        @open = open
        @breakpoint = breakpoint
        @direction = direction
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = responsive_dialog_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)) do
          # Mobile: Drawer (hidden on md and up)
          mobile_wrapper + desktop_wrapper
        end
      end

      private

      def mobile_wrapper
        content_tag :div, class: "md:hidden", data: { "ui--responsive-dialog-target": "drawer" } do
          render_drawer
        end
      end

      def desktop_wrapper
        content_tag :div, class: "hidden md:block", data: { "ui--responsive-dialog-target": "dialog" } do
          render_dialog
        end
      end

      def render_drawer
        render UI::DrawerComponent.new(open: @open, direction: @direction) do
          content
        end
      end

      def render_dialog
        render UI::DialogComponent.new(open: @open) do
          content
        end
      end
    end
