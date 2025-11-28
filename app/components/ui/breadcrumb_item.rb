# frozen_string_literal: true

    # Item - Phlex implementation
    #
    # Individual breadcrumb entry within the breadcrumb list.
    # Uses BreadcrumbItemBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Item.new do
    #     render UI::Link.new(href: "/") { "Home" }
    #   end
    class UI::BreadcrumbItem < Phlex::HTML
      include UI::BreadcrumbItemBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        li(**breadcrumb_item_html_attributes) do
          yield if block_given?
        end
      end
    end
