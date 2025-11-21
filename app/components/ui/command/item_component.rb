# frozen_string_literal: true

module UI
  module Command
    class ItemComponent < ViewComponent::Base
      include ItemBehavior

      def initialize(value: nil, disabled: false, classes: "", **attributes)
        @value = value
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:div, content, **command_item_html_attributes.deep_merge(@attributes))
      end
    end
  end
end
