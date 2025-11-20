# frozen_string_literal: true

module UI
  module Item
    class MediaComponent < ViewComponent::Base
      include UI::Item::ItemMediaBehavior

      def initialize(variant: "default", classes: "", **attributes)
        @variant = variant
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **item_media_html_attributes
      end

      private

      attr_reader :variant, :classes, :attributes
    end
  end
end
