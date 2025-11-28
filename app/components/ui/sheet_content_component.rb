# frozen_string_literal: true

    # Sheet content component (ViewComponent)
    # Main content panel with side variants and slide animations
    #
    # @example
    #   <%= render UI::ContentComponent.new(side: "right") do %>
    #     <!-- Content -->
    #   <% end %>
    class UI::SheetContentComponent < ViewComponent::Base
      include UI::SheetContentBehavior

      # @param side [String] Position: "top", "right", "bottom", "left"
      # @param open [Boolean] whether the sheet is open
      # @param show_close [Boolean] whether to show built-in close button
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(side: "right", open: false, show_close: true, classes: "", **attributes)
        @side = side
        @open = open
        @show_close = show_close
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = sheet_content_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)) do
          safe_join([
            content,
            close_button
          ].compact)
        end
      end

      private

      def close_button
        return unless @show_close

        content_tag :button,
          class: sheet_content_close_button_classes,
          data: { action: "click->ui--dialog#close" } do
          safe_join([
            lucide_icon("x", class: "size-4"),
            content_tag(:span, "Close", class: "sr-only")
          ])
        end
      end
    end
