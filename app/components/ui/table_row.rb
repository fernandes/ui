# frozen_string_literal: true

    class UI::TableRow < Phlex::HTML
      include UI::TableRowBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        tr(**row_html_attributes.deep_merge(@attributes)) do
          yield(self) if block_given?
        end
      end

      # DSL methods
      def head(classes: "", **attributes, &block)
        render Head.new(classes: classes, **attributes, &block)
      end

      def cell(classes: "", **attributes, &block)
        render Cell.new(classes: classes, **attributes, &block)
      end
    end
