# frozen_string_literal: true

module UI
  module ScrollArea
    # ScrollAreaComponent - ViewComponent implementation
    #
    # Augments native scroll functionality for custom, cross-browser styling.
    # Root container with Stimulus controller.
    #
    # @example Basic usage
    #   <%= render UI::ScrollArea::ScrollAreaComponent.new(classes: "h-[200px] w-[350px] rounded-md border p-4") do %>
    #     <div class="space-y-4">
    #       <h3 class="text-sm font-semibold">Tags</h3>
    #       <!-- Content here -->
    #     </div>
    #   <% end %>
    class ScrollAreaComponent < ViewComponent::Base
      include UI::ScrollAreaBehavior

      # @param type [String] Scrollbar visibility behavior ("hover", "scroll", "auto", "always")
      # @param scroll_hide_delay [Integer] Delay in ms before hiding scrollbar on hover
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(type: "hover", scroll_hide_delay: 600, classes: "", **attributes)
        @type = type
        @scroll_hide_delay = scroll_hide_delay
        @classes = classes
        @attributes = attributes
      end

      def call
        root_attrs = scroll_area_html_attributes.deep_merge(@attributes)

        # Add Stimulus controller and values
        root_attrs[:data] ||= {}
        root_attrs[:data][:controller] = "ui--scroll-area"
        root_attrs[:data][:ui__scroll_area_type_value] = @type
        root_attrs[:data][:ui__scroll_area_scroll_hide_delay_value] = @scroll_hide_delay

        content_tag :div, **root_attrs do
          safe_join([
            render(UI::ScrollArea::ViewportComponent.new) { content },
            render(UI::ScrollArea::ScrollbarComponent.new(orientation: "vertical")),
            render(UI::ScrollArea::CornerComponent.new)
          ])
        end
      end
    end
  end
end
