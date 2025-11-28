# frozen_string_literal: true

    class UI::CardHeader < Phlex::HTML
      include UI::CardHeaderBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&)
        div(**card_header_html_attributes.deep_merge(@attributes), &)
      end
    end
