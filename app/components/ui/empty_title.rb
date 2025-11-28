# frozen_string_literal: true

    # EmptyTitle - Phlex implementation
    #
    # Displays the title of the empty state.
    #
    # @example
    #   render UI::EmptyTitle.new { "No results found" }
    class UI::EmptyTitle < Phlex::HTML
      include UI::EmptyTitleBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        h3(**empty_title_html_attributes.merge(@attributes), &block)
      end
    end
