# frozen_string_literal: true

module UI
  module Sidebar
    # Header - Phlex implementation
    #
    # Fixed header section at the top of the sidebar.
    #
    # @example Basic usage
    #   render UI::Sidebar::Header.new do
    #     # Header content (logo, brand, etc.)
    #   end
    class Header < Phlex::HTML
      include UI::Sidebar::HeaderBehavior

      # @param classes [String] Additional CSS classes
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_header_html_attributes

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
