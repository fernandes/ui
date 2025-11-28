# frozen_string_literal: true

    # ShortcutComponent - ViewComponent implementation
    #
    # Keyboard shortcut display.
    #
    # @example Basic usage
    #   render UI::ShortcutComponent.new { "⌘S" }
    class UI::MenubarShortcutComponent < ViewComponent::Base
      include UI::MenubarShortcutBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :span, **menubar_shortcut_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
