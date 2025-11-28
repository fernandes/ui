# frozen_string_literal: true

    class UI::TableCellComponent < ViewComponent::Base
      include UI::TableCellBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :td, content, **cell_html_attributes.deep_merge(@attributes)
      end
    end
