# frozen_string_literal: true

module UI
  module Breadcrumb
    # List - Phlex implementation
    #
    # Container for breadcrumb items, rendered as an ordered list.
    # Uses BreadcrumbListBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Breadcrumb::List.new do
    #     render UI::Breadcrumb::Item.new { "Item content" }
    #   end
    class List < Phlex::HTML
      include UI::Breadcrumb::BreadcrumbListBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        ol(**breadcrumb_list_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
