# frozen_string_literal: true

module UI
  module Table
    class CellComponent < ViewComponent::Base
      include CellBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def call
        content_tag :td, content, **cell_html_attributes.deep_merge(@attributes)
      end
    end
  end
end
