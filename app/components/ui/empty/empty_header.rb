# frozen_string_literal: true

module UI
  module Empty
    # EmptyHeader - Phlex implementation
    #
    # Wraps the empty media, title, and description.
    #
    # @example
    #   render UI::Empty::EmptyHeader.new do
    #     render UI::Empty::EmptyMedia.new(variant: "icon") { icon }
    #     render UI::Empty::EmptyTitle.new { "No results" }
    #     render UI::Empty::EmptyDescription.new { "Try adjusting your search." }
    #   end
    class EmptyHeader < Phlex::HTML
      include UI::EmptyHeaderBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**empty_header_html_attributes.merge(@attributes), &block)
      end
    end
  end
end
