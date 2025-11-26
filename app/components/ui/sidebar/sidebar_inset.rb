# frozen_string_literal: true

module UI
  module Sidebar
    # SidebarInset - Phlex implementation
    #
    # Main content area that sits alongside the sidebar.
    # Should be used as a sibling to Sidebar within SidebarProvider.
    #
    # @example Basic usage
    #   render UI::Sidebar::SidebarProvider.new do
    #     render UI::Sidebar::Sidebar.new { "Sidebar" }
    #     render UI::Sidebar::SidebarInset.new do
    #       # Main content here
    #     end
    #   end
    class SidebarInset < Phlex::HTML
      include UI::Sidebar::SidebarInsetBehavior

      # @param classes [String] Additional CSS classes
      # @param attributes [Hash] Additional HTML attributes
      def initialize(classes: "", **attributes)
        @classes = classes
        @attributes = attributes
      end

      def view_template(&block)
        all_attributes = sidebar_inset_html_attributes

        # Merge classes with TailwindMerge
        if @attributes.key?(:class)
          merged_class = TailwindMerge::Merger.new.merge([
            all_attributes[:class],
            @attributes[:class]
          ].compact.join(" "))
          all_attributes = all_attributes.merge(class: merged_class)
        end

        # Deep merge other attributes (excluding class)
        all_attributes = all_attributes.deep_merge(@attributes.except(:class))

        main(**all_attributes, &block)
      end
    end
  end
end
