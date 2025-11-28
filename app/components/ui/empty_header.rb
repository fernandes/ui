# frozen_string_literal: true

    # EmptyHeader - Phlex implementation
    #
    # Wraps the empty media, title, and description.
    #
    # @example
    #   render UI::EmptyHeader.new do
    #     render UI::EmptyMedia.new(variant: "icon") { icon }
    #     render UI::EmptyTitle.new { "No results" }
    #     render UI::EmptyDescription.new { "Try adjusting your search." }
    #   end
    class UI::EmptyHeader < Phlex::HTML
      include UI::EmptyHeaderBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**empty_header_html_attributes.merge(@attributes), &block)
      end
    end
