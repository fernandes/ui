# frozen_string_literal: true

    class UI::ItemFooter < Phlex::HTML
      include UI::ItemFooterBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**item_footer_html_attributes, &block)
      end
    end
