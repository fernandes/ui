# frozen_string_literal: true

module UI
  module Sidebar
    # Footer - Phlex implementation
    #
    # Fixed footer section at the bottom of the sidebar.
    #
    # @example Basic usage
    #   render UI::Sidebar::Footer.new do
    #     # Footer content (user menu, settings, etc.)
    #   end
    class Footer < Phlex::HTML
      include UI::Sidebar::FooterBehavior

      # @param classes [String] Additional CSS classes
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_footer_html_attributes

        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        div(**all_attributes, &block)
      end
    end
  end
end
