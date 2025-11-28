# frozen_string_literal: true

    # BreadcrumbPageComponent - ViewComponent implementation
    #
    # Current page indicator (non-clickable) for breadcrumbs.
    # Uses BreadcrumbPageBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::BreadcrumbPageComponent.new do %>
    #     Current Page
    #   <% end %>
    class UI::BreadcrumbPageComponent < ViewComponent::Base
      include UI::BreadcrumbPageBehavior

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
