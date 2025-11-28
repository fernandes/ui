# frozen_string_literal: true

    # EmptyTitleComponent - ViewComponent implementation
    class UI::EmptyTitleComponent < ViewComponent::Base
      include UI::EmptyTitleBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        tag.h3(**empty_title_html_attributes.merge(@attributes)) do
          content
        end
      end
    end
