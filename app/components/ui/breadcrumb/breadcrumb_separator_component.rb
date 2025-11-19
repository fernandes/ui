# frozen_string_literal: true

module UI
  module Breadcrumb
    # BreadcrumbSeparatorComponent - ViewComponent implementation
    #
    # Visual divider between breadcrumb items with default chevron icon.
    # Uses BreadcrumbSeparatorBehavior concern for shared styling logic.
    #
    # @example Default separator
    #   <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new %>
    #
    # @example Custom separator
    #   <%= render UI::Breadcrumb::BreadcrumbSeparatorComponent.new do %>
    #     /
    #   <% end %>
    class BreadcrumbSeparatorComponent < ViewComponent::Base
      include UI::Breadcrumb::BreadcrumbSeparatorBehavior

      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :li, **breadcrumb_separator_html_attributes do
          if content.present?
            content
          else
            default_separator_icon
          end
        end
      end

      private

      attr_reader :classes, :attributes

      def default_separator_icon
        content_tag :svg, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24",
                    viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
                    "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round",
                    class: "lucide lucide-chevron-right" do
          content_tag :path, nil, d: "m9 18 6-6-6-6"
        end
      end
    end
  end
end
