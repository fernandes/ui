# frozen_string_literal: true

    class UI::ItemMedia < Phlex::HTML
      include UI::ItemMediaBehavior

      def initialize(variant: "default", classes: "", **attributes)
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**item_media_html_attributes, &block)
      end
    end
