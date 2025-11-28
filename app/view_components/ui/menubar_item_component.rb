# frozen_string_literal: true

    # ItemComponent - ViewComponent implementation
    #
    # A menu item.
    #
    # @example Basic usage
    #   render UI::ItemComponent.new { "Save" }
    #
    # @example With shortcut
    #   render UI::ItemComponent.new do
    #     "Save"
    #     render UI::ShortcutComponent.new { "⌘S" }
    #   end
    class UI::MenubarItemComponent < ViewComponent::Base
      include UI::MenubarItemBehavior

      def initialize(variant: nil, inset: false, disabled: false, classes: "", **attributes)
        @variant = variant
        @inset = inset
        @disabled = disabled
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_item_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
