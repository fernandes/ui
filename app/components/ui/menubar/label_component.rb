# frozen_string_literal: true

module UI
  module Menubar
    # LabelComponent - ViewComponent implementation
    #
    # Non-interactive label for grouping items.
    #
    # @example Basic usage
    #   render UI::Menubar::LabelComponent.new { "Theme" }
    class LabelComponent < ViewComponent::Base
      include UI::Menubar::MenubarLabelBehavior

      def initialize(inset: false, classes: "", **attributes)
        @inset = inset
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :div, **menubar_label_html_attributes.deep_merge(@attributes) do
          content
        end
      end
    end
  end
end
