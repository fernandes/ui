# frozen_string_literal: true

    # BreadcrumbListComponent - ViewComponent implementation
    #
    # Container for breadcrumb items, rendered as an ordered list.
    # Uses BreadcrumbListBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::BreadcrumbListComponent.new do %>
    #     <%= render UI::BreadcrumbItemComponent.new do %>
    #       Item content
    #     <% end %>
    #   <% end %>
    class UI::BreadcrumbListComponent < ViewComponent::Base
      include UI::BreadcrumbListBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :ol, **breadcrumb_list_html_attributes do
          content
        end
      end
    end
