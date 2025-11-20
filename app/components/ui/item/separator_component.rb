# frozen_string_literal: true

module UI
  module Item
    class SeparatorComponent < ViewComponent::Base
      include UI::Item::ItemSeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :hr, nil, **item_separator_html_attributes
      end

      private

      attr_reader :classes, :attributes
    end
  end
end
