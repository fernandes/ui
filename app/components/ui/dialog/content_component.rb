# frozen_string_literal: true

module UI
  module Dialog
    # Dialog content component (ViewComponent)
    # Main content area for the dialog
    #
    # @example
    #   <%= render UI::Dialog::ContentComponent.new do %>
    #     <!-- Content -->
    #   <% end %>
    class ContentComponent < ViewComponent::Base
      include UI::Dialog::DialogContentBehavior

      # @param open [Boolean] whether the dialog is open
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(open: false, classes: "", **attributes)
        @open = open
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = dialog_content_html_attributes
        attrs[:data] = attrs[:data].merge(@attributes.fetch(:data, {}))

        content_tag :div, content, **attrs.merge(@attributes.except(:data))
      end
    end
  end
end
