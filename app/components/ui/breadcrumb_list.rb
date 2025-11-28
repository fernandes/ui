# frozen_string_literal: true

    # List - Phlex implementation
    #
    # Container for breadcrumb items, rendered as an ordered list.
    # Uses BreadcrumbListBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::List.new do
    #     render UI::Item.new { "Item content" }
    #   end
    class UI::BreadcrumbList < Phlex::HTML
      include UI::BreadcrumbListBehavior

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
