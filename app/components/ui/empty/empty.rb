# frozen_string_literal: true

module UI
  module Empty
    # Empty - Phlex implementation
    #
    # Displays empty states in applications with customizable media, titles, descriptions, and actions.
    #
    # @example Basic usage
    #   render UI::Empty::Empty.new do
    #     render UI::Empty::EmptyHeader.new do
    #       render UI::Empty::EmptyTitle.new { "No results found" }
    #       render UI::Empty::EmptyDescription.new { "Try adjusting your search criteria." }
    #     end
    #   end
    class Empty < Phlex::HTML
      include UI::EmptyBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**empty_html_attributes.merge(@attributes), &block)
      end
    end
  end
end
