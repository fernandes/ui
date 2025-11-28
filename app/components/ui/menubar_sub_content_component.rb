# frozen_string_literal: true

    # SubContentComponent - ViewComponent implementation
    #
    # Container for submenu items.
    #
    # @example Basic usage
    #   render UI::SubContentComponent.new do
    #     render UI::ItemComponent.new { "Email" }
    #     render UI::ItemComponent.new { "Message" }
    #   end
    class UI::MenubarSubContentComponent < ViewComponent::Base
      include UI::MenubarSubContentBehavior

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
