# frozen_string_literal: true

module UI
  module Table
    class Cell < Phlex::HTML
      include CellBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        td(**cell_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
