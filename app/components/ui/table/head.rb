# frozen_string_literal: true

module UI
  module Table
    class Head < Phlex::HTML
      include HeadBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        th(**head_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
  end
end
