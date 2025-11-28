# frozen_string_literal: true

    class UI::TableCaption < Phlex::HTML
      include UI::TableCaptionBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        caption(**caption_html_attributes.deep_merge(@attributes)) do
          yield if block_given?
        end
      end
    end
