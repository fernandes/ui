# frozen_string_literal: true

module UI
  module Menubar
    # ItemComponent - ViewComponent implementation
    #
    # A menu item.
    #
    # @example Basic usage
    #   render UI::Menubar::ItemComponent.new { "Save" }
    #
    # @example With shortcut
    #   render UI::Menubar::ItemComponent.new do
    #     "Save"
    #     render UI::Menubar::ShortcutComponent.new { "⌘S" }
    #   end
    class ItemComponent < ViewComponent::Base
      include UI::Menubar::MenubarItemBehavior

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
  end
end
