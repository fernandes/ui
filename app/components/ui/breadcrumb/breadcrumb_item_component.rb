# frozen_string_literal: true

module UI
  module Breadcrumb
    # BreadcrumbItemComponent - ViewComponent implementation
    #
    # Individual breadcrumb entry within the breadcrumb list.
    # Uses BreadcrumbItemBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
    #     <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") do %>
    #       Home
    #     <% end %>
    #   <% end %>
    class BreadcrumbItemComponent < ViewComponent::Base
      include UI::Breadcrumb::BreadcrumbItemBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :li, **breadcrumb_item_html_attributes do
          content
        end
      end
    end
  end
end
