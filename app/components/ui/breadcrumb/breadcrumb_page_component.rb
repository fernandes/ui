# frozen_string_literal: true

module UI
  module Breadcrumb
    # BreadcrumbPageComponent - ViewComponent implementation
    #
    # Current page indicator (non-clickable) for breadcrumbs.
    # Uses BreadcrumbPageBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Breadcrumb::BreadcrumbPageComponent.new do %>
    #     Current Page
    #   <% end %>
    class BreadcrumbPageComponent < ViewComponent::Base
      include UI::Breadcrumb::BreadcrumbPageBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :span, **breadcrumb_page_html_attributes do
          content
        end
      end
    end
  end
end
