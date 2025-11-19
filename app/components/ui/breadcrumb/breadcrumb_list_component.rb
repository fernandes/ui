# frozen_string_literal: true

module UI
  module Breadcrumb
    # BreadcrumbListComponent - ViewComponent implementation
    #
    # Container for breadcrumb items, rendered as an ordered list.
    # Uses BreadcrumbListBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::Breadcrumb::BreadcrumbListComponent.new do %>
    #     <%= render UI::Breadcrumb::BreadcrumbItemComponent.new do %>
    #       Item content
    #     <% end %>
    #   <% end %>
    class BreadcrumbListComponent < ViewComponent::Base
      include UI::Breadcrumb::BreadcrumbListBehavior

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
  end
end
