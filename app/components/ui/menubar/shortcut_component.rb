# frozen_string_literal: true

module UI
  module Menubar
    # ShortcutComponent - ViewComponent implementation
    #
    # Keyboard shortcut display.
    #
    # @example Basic usage
    #   render UI::Menubar::ShortcutComponent.new { "⌘S" }
    class ShortcutComponent < ViewComponent::Base
      include UI::Menubar::MenubarShortcutBehavior

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
  end
end
