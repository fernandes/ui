# frozen_string_literal: true

module UI
  module Table
    class CaptionComponent < ViewComponent::Base
      include CaptionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :caption, content, **caption_html_attributes.deep_merge(@attributes)
      end
    end
  end
end
