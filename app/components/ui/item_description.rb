# frozen_string_literal: true

    class UI::ItemDescription < Phlex::HTML
      include UI::ItemDescriptionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        p(**item_description_html_attributes, &block)
      end
    end
