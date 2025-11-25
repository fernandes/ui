# frozen_string_literal: true

module UI
  module Table
    class HeadComponent < ViewComponent::Base
      include HeadBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :th, content, **head_html_attributes.deep_merge(@attributes)
      end
    end
  end
end
