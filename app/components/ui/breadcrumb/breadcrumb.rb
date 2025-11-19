# frozen_string_literal: true

module UI
  module Breadcrumb
    # Breadcrumb - Phlex implementation
    #
    # A navigation breadcrumb component for displaying hierarchical navigation.
    # Uses BreadcrumbBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Breadcrumb::Breadcrumb.new do
    #     render UI::Breadcrumb::List.new do
    #       render UI::Breadcrumb::Item.new do
    #         render UI::Breadcrumb::Link.new(href: "/") { "Home" }
    #       end
    #     end
    #   end
    class Breadcrumb < Phlex::HTML
      include UI::Breadcrumb::BreadcrumbBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        nav(**breadcrumb_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
