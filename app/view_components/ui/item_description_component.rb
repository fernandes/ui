# frozen_string_literal: true

    class UI::ItemDescriptionComponent < ViewComponent::Base
      include UI::ItemDescriptionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :p, content, **item_description_html_attributes
      end

      private

      attr_reader :classes, :attributes
    end
