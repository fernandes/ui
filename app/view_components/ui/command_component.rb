# frozen_string_literal: true

    class UI::CommandComponent < ViewComponent::Base
      include UI::CommandBehavior

      def initialize(loop: true, classes: "", **attributes)
        @loop = loop
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:div, content, **command_html_attributes.deep_merge(@attributes))
      end
    end
