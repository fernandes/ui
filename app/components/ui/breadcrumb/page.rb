# frozen_string_literal: true

module UI
  module Breadcrumb
    # Page - Phlex implementation
    #
    # Current page indicator (non-clickable) for breadcrumbs.
    # Uses BreadcrumbPageBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Breadcrumb::Page.new { "Current Page" }
    class Page < Phlex::HTML
      include UI::Breadcrumb::BreadcrumbPageBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        span(**breadcrumb_page_html_attributes) do
          yield if block_given?
        end
      end
    end
  end
end
