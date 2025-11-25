# frozen_string_literal: true

module UI
  module Dialog
    # Dialog container component (ViewComponent)
    # A modal dialog window that renders content over the main page
    #
    # @example Basic usage
    #   <%= render UI::Dialog::DialogComponent.new do %>
    #     <%= render UI::Dialog::TriggerComponent.new { "Open Dialog" } %>
    #     <%= render UI::Dialog::OverlayComponent.new do %>
    #       <%= render UI::Dialog::ContentComponent.new do %>
    #         <%= render UI::Dialog::HeaderComponent.new do %>
    #           <%= render UI::Dialog::TitleComponent.new { "Dialog Title" } %>
    #           <%= render UI::Dialog::DescriptionComponent.new { "Dialog description" } %>
    #         <% end %>
    #         <!-- Content -->
    #         <%= render UI::Dialog::FooterComponent.new do %>
    #           <%= render UI::Dialog::CloseComponent.new { "Cancel" } %>
    #         <% end %>
    #       <% end %>
    #     <% end %>
    #   <% end %>
    class DialogComponent < ViewComponent::Base
      include UI::Dialog::DialogBehavior

      # @param open [Boolean] whether the dialog is open
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
        attrs = dialog_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, content, **attrs.merge(@attributes.except(:data))
      end
    end
  end
end
