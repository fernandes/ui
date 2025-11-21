# frozen_string_literal: true

module UI
  module Command
    class CommandComponent < ViewComponent::Base
      include CommandBehavior

      def initialize(loop: true, classes: "", **attributes)
        @loop = loop
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:div, content, **command_html_attributes.deep_merge(@attributes))
      end
    end
  end
end
