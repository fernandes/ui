# frozen_string_literal: true

module UI
  module Menubar
    # TriggerComponent - ViewComponent implementation
    #
    # Button that opens a menu.
    #
    # @example Basic usage
    #   render UI::Menubar::TriggerComponent.new { "File" }
    class TriggerComponent < ViewComponent::Base
      include UI::Menubar::MenubarTriggerBehavior

      def initialize(first: false, classes: "", **attributes)
        @first = first
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :button, **menubar_trigger_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
  end
end
