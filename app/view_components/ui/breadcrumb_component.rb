# frozen_string_literal: true

    # BreadcrumbComponent - ViewComponent implementation
    #
    # A navigation breadcrumb component for displaying hierarchical navigation.
    # Uses BreadcrumbBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::BreadcrumbComponent.new do %>
    #     <%= render UI::BreadcrumbListComponent.new do %>
    #       <%= render UI::BreadcrumbItemComponent.new do %>
    #         <%= render UI::BreadcrumbLinkComponent.new(href: "/") do %>
    #           Home
    #         <% end %>
    #       <% end %>
    #     <% end %>
    #   <% end %>
    class UI::BreadcrumbComponent < ViewComponent::Base
      include UI::BreadcrumbBehavior

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
