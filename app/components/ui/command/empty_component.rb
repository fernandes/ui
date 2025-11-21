# frozen_string_literal: true

module UI
  module Command
    class EmptyComponent < ViewComponent::Base
      include EmptyBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:div, content, **command_empty_html_attributes.deep_merge(@attributes))
      end
    end
  end
end
