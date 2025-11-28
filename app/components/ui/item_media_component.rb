# frozen_string_literal: true

    class UI::ItemMediaComponent < ViewComponent::Base
      include UI::ItemMediaBehavior

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
