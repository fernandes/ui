# frozen_string_literal: true

module UI
  module Breadcrumb
    # Separator - Phlex implementation
    #
    # Visual divider between breadcrumb items with default chevron icon.
    # Uses BreadcrumbSeparatorBehavior concern for shared styling logic.
    #
    # @example Default separator
    #   render UI::Breadcrumb::Separator.new
    #
    # @example Custom separator
    #   render UI::Breadcrumb::Separator.new { "/" }
    class Separator < Phlex::HTML
      include UI::Breadcrumb::BreadcrumbSeparatorBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        li(**breadcrumb_separator_html_attributes) do
          if block_given?
            yield
          else
            default_separator_icon
          end
        end
      end

      private

      def default_separator_icon
        svg(
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          stroke_width: "2",
          stroke_linecap: "round",
          stroke_linejoin: "round",
          class: "lucide lucide-chevron-right"
        ) do |s|
          s.path(d: "m9 18 6-6-6-6")
        end
      end
    end
  end
end
