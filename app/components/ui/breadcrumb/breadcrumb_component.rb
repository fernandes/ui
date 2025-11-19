# frozen_string_literal: true

module UI
  module Breadcrumb
    # BreadcrumbComponent - ViewComponent implementation
    #
    # A navigation breadcrumb component for displaying hierarchical navigation.
    # Uses BreadcrumbBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Breadcrumb::BreadcrumbComponent.new do %>
    #     <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    #       <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
    #         <%= render UI::Breadcrumb::BreadcrumbLinkComponent.new(href: "/") do %>
    #           Home
    #         <% end %>
    #       <% end %>
    #     <% end %>
    #   <% end %>
    class BreadcrumbComponent < ViewComponent::Base
      include UI::Breadcrumb::BreadcrumbBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :nav, **breadcrumb_html_attributes do
          content
        end
      end
    end
  end
end
