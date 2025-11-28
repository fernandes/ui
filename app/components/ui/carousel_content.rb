# frozen_string_literal: true

    class UI::CarouselContent < Phlex::HTML
      def initialize(classes: nil, **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        extend UI::CarouselContentBehavior
        div(**carousel_content_html_attributes) do
          div(**carousel_content_container_html_attributes, &block)
        end
      end
    end
