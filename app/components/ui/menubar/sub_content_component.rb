# frozen_string_literal: true

module UI
  module Menubar
    # SubContentComponent - ViewComponent implementation
    #
    # Container for submenu items.
    #
    # @example Basic usage
    #   render UI::Menubar::SubContentComponent.new do
    #     render UI::Menubar::ItemComponent.new { "Email" }
    #     render UI::Menubar::ItemComponent.new { "Message" }
    #   end
    class SubContentComponent < ViewComponent::Base
      include UI::Menubar::MenubarSubContentBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_sub_content_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
  end
end
