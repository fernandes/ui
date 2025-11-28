# frozen_string_literal: true

    class UI::CollapsibleContent < Phlex::HTML
      include UI::CollapsibleContentBehavior

      def initialize(force_mount: false, classes: "", **attributes)
        @force_mount = force_mount
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**collapsible_content_html_attributes.deep_merge(@attributes), &block)
      end
    end
