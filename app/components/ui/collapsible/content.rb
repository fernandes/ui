# frozen_string_literal: true

module UI
  module Collapsible
    class Content < Phlex::HTML
      include ContentBehavior

      def initialize(force_mount: false, classes: "", **attributes)
        @force_mount = force_mount
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        div(**collapsible_content_html_attributes.deep_merge(@attributes), &block)
      end
    end
  end
end
