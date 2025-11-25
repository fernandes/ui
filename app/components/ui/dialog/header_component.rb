# frozen_string_literal: true

module UI
  module Dialog
    # Dialog header component (ViewComponent)
    # Header section for the dialog
    #
    # @example
    #   <%= render UI::Dialog::HeaderComponent.new do %>
    #     <%= render UI::Dialog::TitleComponent.new { "Title" } %>
    #     <%= render UI::Dialog::DescriptionComponent.new { "Description" } %>
    #   <% end %>
    class HeaderComponent < ViewComponent::Base
      include UI::Dialog::DialogHeaderBehavior

      # @param classes [String] additional CSS classes
      def initialize(classes: "")
        @classes = classes
      end

      def call
        content_tag :div, content, **dialog_header_html_attributes
      end
    end
  end
end
