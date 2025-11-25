# frozen_string_literal: true

module UI
  module Sheet
    # Sheet container component (ViewComponent)
    # A panel that slides in from the edge of the screen
    #
    # @example Basic usage
    #   <%= render UI::Sheet::SheetComponent.new do %>
    #     <%= render UI::Sheet::TriggerComponent.new { "Open Sheet" } %>
    #     <%= render UI::Sheet::OverlayComponent.new do %>
    #       <%= render UI::Sheet::ContentComponent.new do %>
    #         <%= render UI::Sheet::HeaderComponent.new do %>
    #           <%= render UI::Sheet::TitleComponent.new { "Sheet Title" } %>
    #           <%= render UI::Sheet::DescriptionComponent.new { "Sheet description" } %>
    #         <% end %>
    #         <!-- Content -->
    #         <%= render UI::Sheet::FooterComponent.new do %>
    #           <%= render UI::Sheet::CloseComponent.new { "Cancel" } %>
    #         <% end %>
    #       <% end %>
    #     <% end %>
    #   <% end %>
    class SheetComponent < ViewComponent::Base
      include UI::Sheet::SheetBehavior

      # @param open [Boolean] whether the sheet is open
      # @param close_on_escape [Boolean] close on Escape key press
      # @param close_on_overlay_click [Boolean] close on overlay click
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(
        open: false,
        close_on_escape: true,
        close_on_overlay_click: true,
        classes: "",
        **attributes
      )
        @open = open
        @close_on_escape = close_on_escape
        @close_on_overlay_click = close_on_overlay_click
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = sheet_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, content, **attrs.merge(@attributes.except(:data))
      end
    end
  end
end
