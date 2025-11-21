# frozen_string_literal: true

module UI
  module Command
    class ShortcutComponent < ViewComponent::Base
      include ShortcutBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:span, content, **command_shortcut_html_attributes.deep_merge(@attributes))
      end
    end
  end
end
