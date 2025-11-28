# frozen_string_literal: true

    # RadioGroupComponent - ViewComponent implementation
    #
    # Container for radio items.
    #
    # @example Basic usage
    #   render UI::RadioGroupComponent.new do
    #     render UI::RadioItemComponent.new(value: "light") { "Light" }
    #     render UI::RadioItemComponent.new(value: "dark") { "Dark" }
    #   end
    class UI::MenubarRadioGroupComponent < ViewComponent::Base
      include UI::MenubarRadioGroupBehavior

      def initialize(value: nil, classes: "", **attributes)
        @value = value
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_radio_group_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
