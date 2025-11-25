# frozen_string_literal: true

module UI
  module Menubar
    # SeparatorComponent - ViewComponent implementation
    #
    # Visual separator between menu items.
    #
    # @example Basic usage
    #   render UI::Menubar::SeparatorComponent.new
    class SeparatorComponent < ViewComponent::Base
      include UI::Menubar::MenubarSeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, "", **menubar_separator_html_attributes.deep_merge(@attributes)
      end
    end
  end
end
