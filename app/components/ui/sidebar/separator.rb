# frozen_string_literal: true

module UI
  module Sidebar
    # Separator - Phlex implementation
    #
    # Visual divider within the sidebar.
    #
    # @example Basic usage
    #   render UI::Sidebar::Separator.new
    class Separator < Phlex::HTML
      include UI::Sidebar::SeparatorBehavior

      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template
        all_attributes = sidebar_separator_html_attributes

        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        div(**all_attributes)
      end
    end
  end
end
