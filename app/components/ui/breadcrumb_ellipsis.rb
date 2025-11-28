# frozen_string_literal: true

    # Ellipsis - Phlex implementation
    #
    # Indicator for collapsed/hidden breadcrumb items.
    # Uses BreadcrumbEllipsisBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Ellipsis.new
    class UI::BreadcrumbEllipsis < Phlex::HTML
      include UI::BreadcrumbEllipsisBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        span(**breadcrumb_ellipsis_html_attributes) do
          if block_given?
            yield
          else
            ellipsis_icon
            screen_reader_text
          end
        end
      end

      private

      def ellipsis_icon
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
          class: "lucide lucide-ellipsis h-4 w-4"
        ) do |s|
          s.circle(cx: "12", cy: "12", r: "1")
          s.circle(cx: "19", cy: "12", r: "1")
          s.circle(cx: "5", cy: "12", r: "1")
        end
      end

      def screen_reader_text
        span(class: "sr-only") { "More" }
      end
    end
