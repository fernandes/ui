# frozen_string_literal: true

    class UI::CardTitle < Phlex::HTML
      include UI::CardTitleBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**card_title_html_attributes.deep_merge(@attributes), &)
      end
    end
