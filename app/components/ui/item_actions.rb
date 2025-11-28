# frozen_string_literal: true

    class UI::ItemActions < Phlex::HTML
      include UI::ItemActionsBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**item_actions_html_attributes, &block)
      end
    end
