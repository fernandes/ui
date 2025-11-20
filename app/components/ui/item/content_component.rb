# frozen_string_literal: true

module UI
  module Item
    class ContentComponent < ViewComponent::Base
      include UI::Item::ItemContentBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **item_content_html_attributes
      end

      private

      attr_reader :classes, :attributes
    end
  end
end
