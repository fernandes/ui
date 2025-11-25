# frozen_string_literal: true

module UI
  module Menubar
    # RadioGroupComponent - ViewComponent implementation
    #
    # Container for radio items.
    #
    # @example Basic usage
    #   render UI::Menubar::RadioGroupComponent.new do
    #     render UI::Menubar::RadioItemComponent.new(value: "light") { "Light" }
    #     render UI::Menubar::RadioItemComponent.new(value: "dark") { "Dark" }
    #   end
    class RadioGroupComponent < ViewComponent::Base
      include UI::Menubar::MenubarRadioGroupBehavior

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
  end
end
