# frozen_string_literal: true

    class UI::ItemTitleComponent < ViewComponent::Base
      include UI::ItemTitleBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **item_title_html_attributes
      end

      private

      attr_reader :classes, :attributes
    end
