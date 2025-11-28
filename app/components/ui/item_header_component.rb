# frozen_string_literal: true

    class UI::ItemHeaderComponent < ViewComponent::Base
      include UI::ItemHeaderBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **item_header_html_attributes
      end

      private

      attr_reader :classes, :attributes
    end
