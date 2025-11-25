# frozen_string_literal: true

module UI
  module Sheet
    # Sheet header component (ViewComponent)
    #
    # @example
    #   <%= render UI::Sheet::HeaderComponent.new do %>
    #     <%= render UI::Sheet::TitleComponent.new { "Title" } %>
    #     <%= render UI::Sheet::DescriptionComponent.new { "Description" } %>
    #   <% end %>
    class HeaderComponent < ViewComponent::Base
      include UI::Sheet::SheetHeaderBehavior

      # @param classes [String] additional CSS classes
      def initialize(classes: "")
        @classes = classes
      end

      def call
        content_tag :div, content, **sheet_header_html_attributes
      end
    end
  end
end
