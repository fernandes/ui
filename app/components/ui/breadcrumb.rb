# frozen_string_literal: true

    # Breadcrumb - Phlex implementation
    #
    # A navigation breadcrumb component for displaying hierarchical navigation.
    # Uses BreadcrumbBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Breadcrumb.new do
    #     render UI::List.new do
    #       render UI::Item.new do
    #         render UI::Link.new(href: "/") { "Home" }
    #       end
    #     end
    #   end
    class UI::Breadcrumb < Phlex::HTML
      include UI::BreadcrumbBehavior

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
