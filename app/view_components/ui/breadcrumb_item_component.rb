# frozen_string_literal: true

    # BreadcrumbItemComponent - ViewComponent implementation
    #
    # Individual breadcrumb entry within the breadcrumb list.
    # Uses BreadcrumbItemBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::BreadcrumbItemComponent.new do %>
    #     <%= render UI::BreadcrumbLinkComponent.new(href: "/") do %>
    #       Home
    #     <% end %>
    #   <% end %>
    class UI::BreadcrumbItemComponent < ViewComponent::Base
      include UI::BreadcrumbItemBehavior

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
