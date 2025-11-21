# frozen_string_literal: true

module UI
  module Command
    class SeparatorComponent < ViewComponent::Base
      include SeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:div, nil, **command_separator_html_attributes.deep_merge(@attributes))
      end
    end
  end
end
