# frozen_string_literal: true

module UI
  module Menubar
    # MenubarComponent - ViewComponent implementation
    #
    # Root container for menubar with Stimulus controller.
    #
    # @example Basic usage
    #   render UI::Menubar::MenubarComponent.new do
    #     render UI::Menubar::MenuComponent.new { ... }
    #   end
    class MenubarComponent < ViewComponent::Base
      include UI::Menubar::MenubarBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
  end
end
