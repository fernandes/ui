# frozen_string_literal: true

module UI
  module Table
    class Body < Phlex::HTML
      include BodyBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        tbody(**body_html_attributes.deep_merge(@attributes)) do
          yield(self) if block_given?
        end
      end

      # DSL methods
      def row(classes: "", **attributes, &block)
        render Row.new(classes: classes, **attributes, &block)
      end

      def head(classes: "", **attributes, &block)
        render Head.new(classes: classes, **attributes, &block)
      end

      def cell(classes: "", **attributes, &block)
        render Cell.new(classes: classes, **attributes, &block)
      end
    end
  end
end
