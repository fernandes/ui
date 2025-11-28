# frozen_string_literal: true

    class UI::TableCaptionComponent < ViewComponent::Base
      include UI::TableCaptionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :caption, content, **caption_html_attributes.deep_merge(@attributes)
      end
    end
