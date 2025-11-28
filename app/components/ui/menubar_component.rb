# frozen_string_literal: true

    # MenubarComponent - ViewComponent implementation
    #
    # Root container for menubar with Stimulus controller.
    #
    # @example Basic usage
    #   render UI::MenubarComponent.new do
    #     render UI::MenuComponent.new { ... }
    #   end
    class UI::MenubarComponent < ViewComponent::Base
      include UI::MenubarBehavior

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
