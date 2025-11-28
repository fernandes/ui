# frozen_string_literal: true

    # Pagination Link component (Phlex)
    # Clickable link for page numbers
    class UI::PaginationLink < Phlex::HTML
      include UI::PaginationLinkBehavior

      # @param href [String] URL for the link
      # @param active [Boolean] whether this link is for the current page
      # @param size [String] size variant: "icon", "default", "sm", "lg"
      # @param classes [String] additional CSS classes
      # @param attributes [Hash] additional HTML attributes
      def initialize(href: "#", active: false, size: "icon", classes: "", attributes: {}, **)
        @href = href
        @active = active
        @size = size
        @classes = classes
        @attributes = attributes
        super()
      end

      def view_template(&block)
        a(**link_html_attributes, &block)
      end
    end
