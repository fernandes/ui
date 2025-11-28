# frozen_string_literal: true

    # ScrollArea - Phlex implementation
    #
    # Augments native scroll functionality for custom, cross-browser styling.
    # Root container with Stimulus controller.
    #
    # @example Basic usage
    #   render UI::ScrollArea.new(classes: "h-[200px] w-[350px] rounded-md border p-4") do
    #     div(class: "space-y-4") do
    #       h3(class: "text-sm font-semibold") { "Tags" }
    #       div(class: "space-y-1") do
    #         # Content here
    #       end
    #     end
    #   end
    #
    # @example Horizontal scrolling
    #   render UI::ScrollArea.new(classes: "w-96 whitespace-nowrap rounded-md border") do
    #     # Wide content here
    #   end
    class UI::ScrollArea < Phlex::HTML
      include UI::ScrollAreaBehavior
      include UI::SharedAsChildBehavior

      # @param as_child [Boolean] When true, yields attributes to block instead of rendering div
      # @param type [String] Scrollbar visibility behavior ("hover", "scroll", "auto", "always")
      # @param scroll_hide_delay [Integer] Delay in ms before hiding scrollbar on hover
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(as_child: false, type: "hover", scroll_hide_delay: 600, classes: "", **attributes)
        @as_child = as_child
        @type = type
        @scroll_hide_delay = scroll_hide_delay
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        root_attrs = scroll_area_html_attributes.deep_merge(@attributes)

        # Add Stimulus controller and values
        root_attrs[:data] ||= {}
        root_attrs[:data][:controller] = "ui--scroll-area"
        root_attrs[:data][:ui__scroll_area_type_value] = @type
        root_attrs[:data][:ui__scroll_area_scroll_hide_delay_value] = @scroll_hide_delay

        if @as_child && block_given?
          # asChild mode: yield attributes to block, but also render scrollbar and corner
          yield(root_attrs)
          render UI::Scrollbar.new(orientation: "vertical")
          render UI::Corner.new
        else
          # Default mode: render as div with viewport, scrollbar, and corner
          div(**root_attrs) do
            render UI::Viewport.new(&block)
            render UI::Scrollbar.new(orientation: "vertical")
            render UI::Corner.new
          end
        end
      end
    end
