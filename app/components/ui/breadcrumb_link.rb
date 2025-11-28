# frozen_string_literal: true

    # Link - Phlex implementation
    #
    # Clickable breadcrumb link for navigation.
    # Uses BreadcrumbLinkBehavior concern for shared styling logic.
    #
    # @example Basic usage
    #   render UI::Link.new(href: "/") { "Home" }
    class UI::BreadcrumbLink < Phlex::HTML
      include UI::BreadcrumbLinkBehavior

      # @param href [String] URL for the link
      # @param classes [String] Additional CSS classes to merge
      # @param attributes [Hash] Additional HTML attributes
      def initialize(href: "#", classes: "", **attributes)
        @href = href
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        a(**breadcrumb_link_html_attributes) do
          yield if block_given?
        end
      end
    end
