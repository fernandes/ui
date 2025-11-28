# frozen_string_literal: true

    class UI::CommandShortcutComponent < ViewComponent::Base
      include UI::CommandShortcutBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag(:span, content, **command_shortcut_html_attributes.deep_merge(@attributes))
      end
    end
