# frozen_string_literal: true

    class UI::ItemGroupComponent < ViewComponent::Base
      include UI::ItemGroupBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, content, **item_group_html_attributes
      end

      private

      attr_reader :classes, :attributes
    end
