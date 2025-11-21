# frozen_string_literal: true

module UI
  module Command
    class ListComponent < ViewComponent::Base
      include ListBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:div, content, **command_list_html_attributes.deep_merge(@attributes))
      end
    end
  end
end
