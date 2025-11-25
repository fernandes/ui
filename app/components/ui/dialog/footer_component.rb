# frozen_string_literal: true

module UI
  module Dialog
    # Dialog footer component (ViewComponent)
    # Footer section for the dialog
    #
    # @example
    #   <%= render UI::Dialog::FooterComponent.new do %>
    #     <%= render UI::Dialog::CloseComponent.new { "Close" } %>
    #   <% end %>
    class FooterComponent < ViewComponent::Base
      include UI::Dialog::DialogFooterBehavior

      # @param classes [String] additional CSS classes
      def initialize(classes: "")
        @classes = classes
      end

      def call
        content_tag :div, content, **dialog_footer_html_attributes
      end
    end
  end
end
