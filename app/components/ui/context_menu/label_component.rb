# frozen_string_literal: true

module UI
  module ContextMenu
    # LabelComponent - ViewComponent implementation
    class LabelComponent < ViewComponent::Base
      include UI::ContextMenu::ContextMenuLabelBehavior

      def initialize(inset: false, classes: "", **attributes)
        @inset = inset
        @classes = classes
        @attributes = attributes
      end

      def call
        attrs = context_menu_label_html_attributes
        data_attrs = attrs.delete(:data) || {}
        data_attrs = data_attrs.merge(@attributes.fetch(:data, {}))

        content_tag :div, **attrs.merge(@attributes.except(:data)).merge(data: data_attrs) do
          content
        end
      end
    end
  end
end
