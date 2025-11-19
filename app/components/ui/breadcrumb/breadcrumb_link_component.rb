# frozen_string_literal: true

module UI
  module Breadcrumb
    # BreadcrumbLinkComponent - ViewComponent implementation
    #
    # Clickable breadcrumb link for navigation.
    # Uses BreadcrumbLinkBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") do %>
    #     Home
    #   <% end %>
    class BreadcrumbLinkComponent < ViewComponent::Base
      include UI::Breadcrumb::BreadcrumbLinkBehavior

      # @param href [String] URL for the link
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(href: "#", classes: "", **attributes)
        @href = href
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :a, **breadcrumb_link_html_attributes do
          content
        end
      end
    end
  end
end
