# frozen_string_literal: true

module UI
  module Sheet
    # Sheet footer component (ViewComponent)
    #
    # @example
    #   <%= render UI::Sheet::FooterComponent.new do %>
    #     <%= render UI::Sheet::CloseComponent.new { "Cancel" } %>
    #     <%= render UI::Button::ButtonComponent.new { "Save" } %>
    #   <% end %>
    class FooterComponent < ViewComponent::Base
      include UI::Sheet::SheetFooterBehavior

      # @param classes [String] additional CSS classes
      def initialize(classes: "")
        @classes = classes
      end

      def call
        content_tag :div, content, **sheet_footer_html_attributes
      end
    end
  end
end
