# frozen_string_literal: true

module UI
  module Menubar
    # SubComponent - ViewComponent implementation
    #
    # Container for submenu (trigger + content).
    #
    # @example Basic usage
    #   render UI::Menubar::SubComponent.new do
    #     render UI::Menubar::SubTriggerComponent.new { "Share" }
    #     render UI::Menubar::SubContentComponent.new { ... }
    #   end
    class SubComponent < ViewComponent::Base
      include UI::Menubar::MenubarSubBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_sub_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
  end
end
