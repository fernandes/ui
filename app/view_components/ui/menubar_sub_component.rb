# frozen_string_literal: true

    # SubComponent - ViewComponent implementation
    #
    # Container for submenu (trigger + content).
    #
    # @example Basic usage
    #   render UI::SubComponent.new do
    #     render UI::SubTriggerComponent.new { "Share" }
    #     render UI::SubContentComponent.new { ... }
    #   end
    class UI::MenubarSubComponent < ViewComponent::Base
      include UI::MenubarSubBehavior

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
