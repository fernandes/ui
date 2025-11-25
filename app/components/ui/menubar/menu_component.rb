# frozen_string_literal: true

module UI
  module Menubar
    # MenuComponent - ViewComponent implementation
    #
    # Container for a single menu (trigger + content).
    #
    # @example Basic usage
    #   render UI::Menubar::MenuComponent.new do
    #     render UI::Menubar::TriggerComponent.new { "File" }
    #     render UI::Menubar::ContentComponent.new { ... }
    #   end
    class MenuComponent < ViewComponent::Base
      include UI::Menubar::MenubarMenuBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_menu_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
  end
end
