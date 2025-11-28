# frozen_string_literal: true

    # LabelComponent - ViewComponent implementation
    #
    # Non-interactive label for grouping items.
    #
    # @example Basic usage
    #   render UI::LabelComponent.new { "Theme" }
    class UI::MenubarLabelComponent < ViewComponent::Base
      include UI::MenubarLabelBehavior

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
