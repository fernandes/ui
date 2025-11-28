# frozen_string_literal: true

    # BreadcrumbEllipsisComponent - ViewComponent implementation
    #
    # Indicator for collapsed/hidden breadcrumb items.
    # Uses BreadcrumbEllipsisBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   <%= render UI::BreadcrumbEllipsisComponent.new %>
    class UI::BreadcrumbEllipsisComponent < ViewComponent::Base
      include UI::BreadcrumbEllipsisBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :span, **breadcrumb_ellipsis_html_attributes do
          if content.present?
            content
          else
            safe_join([ellipsis_icon, screen_reader_text])
          end
        end
      end

      private

      attr_reader :classes, :attributes

      def ellipsis_icon
        content_tag :svg, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24",
                    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
                    "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round",
                    class: "lucide lucide-ellipsis h-4 w-4" do
          safe_join([
            content_tag(:circle, nil, cx: "12", cy: "12", r: "1"),
            content_tag(:circle, nil, cx: "19", cy: "12", r: "1"),
            content_tag(:circle, nil, cx: "5", cy: "12", r: "1")
          ])
        end
      end

      def screen_reader_text
        content_tag :span, "More", class: "sr-only"
      end
    end
