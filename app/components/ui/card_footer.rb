# frozen_string_literal: true

    class UI::CardFooter < Phlex::HTML
      include UI::CardFooterBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**card_footer_html_attributes.deep_merge(@attributes), &)
      end
    end
