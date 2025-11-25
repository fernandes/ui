# frozen_string_literal: true

module UI
  module Menubar
    # ContentComponent - ViewComponent implementation
    #
    # Container for menu items.
    #
    # @example Basic usage
    #   render UI::Menubar::ContentComponent.new do
    #     render UI::Menubar::ItemComponent.new { "Item" }
    #   end
    class ContentComponent < ViewComponent::Base
      include UI::Menubar::MenubarContentBehavior

      def initialize(align: "start", side: "bottom", classes: "", **attributes)
        @align = align
        @side = side
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_content_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
  end
end
